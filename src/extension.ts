import * as vscode from 'vscode';
import { accentColors } from './data/accentColors';
import { BibleViewProvider } from './providers/BibleViewProvider';
import { FavoritesViewProvider } from './providers/FavoritesViewProvider';
import { AccentColorService } from './services/AccentColorService';
import { BibleService } from './services/BibleService';
import { FavoriteService } from './services/FavoriteService';

interface AccentColorQuickPickItem extends vscode.QuickPickItem {
    colorValue: string | undefined;
}

function getColorSwatchIcon(hex: string): vscode.Uri {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="${hex}" /></svg>`;

    return vscode.Uri.parse(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
}

export function activate(context: vscode.ExtensionContext) {
    const bibleService = new BibleService();

    const favoriteService = new FavoriteService(context.globalState);
    context.subscriptions.push(favoriteService);

    const accentColorService = new AccentColorService(context.globalState);
    context.subscriptions.push(accentColorService);

    const bibleViewProvider = new BibleViewProvider(
        context.extensionUri,
        bibleService,
        favoriteService,
        accentColorService
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BibleViewProvider.viewType, bibleViewProvider)
    );

    const favoritesViewProvider = new FavoritesViewProvider(favoriteService, accentColorService);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            FavoritesViewProvider.viewType,
            favoritesViewProvider
        )
    );

    const showVerseCommand = vscode.commands.registerCommand('hello-bible.showVerse', async () => {
        try {
            const verse = await bibleService.getDailyVerse();

            vscode.window.showInformationMessage(`${verse.reference}: ${verse.text}`);
        } catch {
            vscode.window.showErrorMessage(
                'Não foi possível carregar o versículo. Verifique sua conexão com a internet.'
            );
        }
    });

    context.subscriptions.push(showVerseCommand);

    const selectAccentColorCommand = vscode.commands.registerCommand(
        'hello-bible.selectAccentColor',
        async () => {
            const currentColor = accentColorService.getAccentColor();

            const items: AccentColorQuickPickItem[] = accentColors.map((option) => ({
                label: option.label,
                description: option.color === currentColor ? '(atual)' : undefined,
                iconPath: option.color
                    ? getColorSwatchIcon(option.color)
                    : new vscode.ThemeIcon('circle-outline'),
                colorValue: option.color,
            }));

            const picked = await vscode.window.showQuickPick(items, {
                title: 'Cor de destaque — Hello Bible',
                placeHolder: 'Escolha a cor usada no versículo do dia e nos favoritos',
            });

            if (picked) {
                accentColorService.setAccentColor(picked.colorValue);
            }
        }
    );

    context.subscriptions.push(selectAccentColorCommand);
}

export function deactivate() {}

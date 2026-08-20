import * as vscode from 'vscode';
import { registerSelectAccentColorCommand } from './commands/selectAccentColor';
import { BibleViewProvider } from './providers/BibleViewProvider';
import { FavoritesViewProvider } from './providers/FavoritesViewProvider';
import { AccentColorService } from './services/AccentColorService';
import { BibleService } from './services/BibleService';
import { FavoriteService } from './services/FavoriteService';

export function activate(context: vscode.ExtensionContext) {
    const bibleService = new BibleService();

    const favoriteService = new FavoriteService(context.globalState);
    context.subscriptions.push(favoriteService);

    const accentColorService = new AccentColorService(context.globalState);
    context.subscriptions.push(accentColorService);

    const bibleViewProvider = new BibleViewProvider(
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

    registerSelectAccentColorCommand(context, accentColorService);
}

export function deactivate() {}

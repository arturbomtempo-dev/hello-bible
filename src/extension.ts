import * as vscode from 'vscode';
import { BibleViewProvider } from './providers/BibleViewProvider';
import { FavoritesViewProvider } from './providers/FavoritesViewProvider';
import { BibleService } from './services/BibleService';
import { FavoriteService } from './services/FavoriteService';

export function activate(context: vscode.ExtensionContext) {
    const bibleService = new BibleService();

    const favoriteService = new FavoriteService(context.globalState);
    context.subscriptions.push(favoriteService);

    const bibleViewProvider = new BibleViewProvider(
        context.extensionUri,
        bibleService,
        favoriteService
    );

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BibleViewProvider.viewType, bibleViewProvider)
    );

    const favoritesViewProvider = new FavoritesViewProvider(favoriteService);

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
}

export function deactivate() {}

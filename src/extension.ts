import * as vscode from 'vscode';
import { BibleViewProvider } from './providers/BibleViewProvider';
import { BibleService } from './services/BibleService';
import { FavoriteService } from './services/FavoriteService';

export function activate(context: vscode.ExtensionContext) {
    const bibleService = new BibleService();

    const favoriteService = new FavoriteService(context.globalState);

    const provider = new BibleViewProvider(context.extensionUri, bibleService, favoriteService);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BibleViewProvider.viewType, provider)
    );

    const showVerseCommand = vscode.commands.registerCommand('hello-bible.showVerse', () => {
        const verse = bibleService.getDailyVerse();

        vscode.window.showInformationMessage(`${verse.reference}: ${verse.text}`);
    });

    context.subscriptions.push(showVerseCommand);
}

export function deactivate() {}

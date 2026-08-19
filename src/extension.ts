import * as vscode from 'vscode';
import { BibleViewProvider } from './providers/BibleViewProvider';
import { BibleService } from './services/BibleService';

export function activate(context: vscode.ExtensionContext) {
    const bibleService = new BibleService();
    const provider = new BibleViewProvider(context.extensionUri, bibleService);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BibleViewProvider.viewType, provider)
    );

    const showVerseCommand = vscode.commands.registerCommand('hello-bible.showVerse', () => {
        const verse = bibleService.getRandomVerse();
        vscode.window.showInformationMessage(`${verse.reference}: ${verse.text}`);
    });

    context.subscriptions.push(showVerseCommand);
}

export function deactivate() {}

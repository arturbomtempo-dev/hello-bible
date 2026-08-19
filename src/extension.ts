import * as vscode from 'vscode';
import { BibleViewProvider } from './BibleViewProvider';

let panel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
    const provider = new BibleViewProvider(context.extensionUri);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(BibleViewProvider.viewType, provider)
    );

    const showVerseCommand = vscode.commands.registerCommand('hello-bible.showVerse', () => {
        vscode.window.showInformationMessage(
            'João 3:16 - Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'
        );
    });

    context.subscriptions.push(showVerseCommand);
}

export function deactivate() {}

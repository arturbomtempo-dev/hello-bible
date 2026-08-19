import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const showVerseCommand = vscode.commands.registerCommand('hello-bible.showVerse', () => {
        const verse = 'João 3:16';
        const text =
            'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.';

        vscode.window.showInformationMessage(`📖 ${verse} — ${text}`);
    });

    context.subscriptions.push(showVerseCommand);
}

export function deactivate() {}

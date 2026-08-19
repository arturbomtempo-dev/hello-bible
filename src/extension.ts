import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hello-bible" is now active!');

    const disposable = vscode.commands.registerCommand('hello-bible.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Hello Bible!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

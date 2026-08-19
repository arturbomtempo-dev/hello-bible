import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "hello-vscode" is now active!');

    const disposable = vscode.commands.registerCommand('hello-vscode.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Hello VS Code!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}

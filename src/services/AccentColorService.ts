import * as vscode from 'vscode';
import { Disposable, Emitter } from '../utils/Emitter';

export class AccentColorService implements Disposable {
    private readonly accentColorKey = 'helloBible.accentColor';

    private readonly _onDidChangeAccentColor = new Emitter<void>();
    readonly onDidChangeAccentColor = this._onDidChangeAccentColor.event;

    constructor(private readonly globalState: vscode.Memento) {}

    getAccentColor(): string | undefined {
        return this.globalState.get<string | undefined>(this.accentColorKey, undefined);
    }

    setAccentColor(color: string | undefined): void {
        void this.globalState.update(this.accentColorKey, color);

        this._onDidChangeAccentColor.fire();
    }

    dispose(): void {
        this._onDidChangeAccentColor.dispose();
    }
}

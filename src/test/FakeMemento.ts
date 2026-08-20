import type * as vscode from 'vscode';

export class FakeMemento implements vscode.Memento {
    private storage = new Map<string, unknown>();

    keys(): readonly string[] {
        return [...this.storage.keys()];
    }

    get<T>(key: string): T | undefined;
    get<T>(key: string, defaultValue: T): T;
    get<T>(key: string, defaultValue?: T): T | undefined {
        if (!this.storage.has(key)) {
            return defaultValue;
        }

        return this.storage.get(key) as T;
    }

    update(key: string, value: unknown): Thenable<void> {
        this.storage.set(key, value);

        return Promise.resolve();
    }

    setKeysForSync(keys: readonly string[]): void {}
}

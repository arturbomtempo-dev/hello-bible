import * as vscode from 'vscode';
import { FavoriteVerse, Verse } from '../models/Verse';
import { Disposable, Emitter } from '../utils/Emitter';

export class FavoriteService implements Disposable {
    private readonly favoritesKey = 'helloBible.favorites';

    private readonly _onDidChangeFavorites = new Emitter<void>();
    readonly onDidChangeFavorites = this._onDidChangeFavorites.event;

    constructor(private readonly globalState: vscode.Memento) {}

    getFavorites(): FavoriteVerse[] {
        return this.globalState.get<FavoriteVerse[]>(this.favoritesKey, []);
    }

    isFavorite(verse: Verse): boolean {
        return this.getFavorites().some((favorite) => favorite.reference === verse.reference);
    }

    addFavorite(verse: Verse): void {
        if (this.isFavorite(verse)) {
            return;
        }

        const favorites = this.getFavorites();

        favorites.push({ ...verse, favoritedAt: new Date().toISOString() });

        void this.globalState.update(this.favoritesKey, favorites);

        this._onDidChangeFavorites.fire();
    }

    removeFavorite(reference: string): void {
        const favorites = this.getFavorites();

        const updatedFavorites = favorites.filter((favorite) => favorite.reference !== reference);

        void this.globalState.update(this.favoritesKey, updatedFavorites);

        this._onDidChangeFavorites.fire();
    }

    toggleFavorite(verse: Verse): boolean {
        if (this.isFavorite(verse)) {
            this.removeFavorite(verse.reference);

            return false;
        }

        this.addFavorite(verse);

        return true;
    }

    dispose(): void {
        this._onDidChangeFavorites.dispose();
    }
}

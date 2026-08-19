import * as vscode from 'vscode';
import { Verse } from '../models/Verse';

export class FavoriteService {
    private readonly favoritesKey = 'helloBible.favorites';

    constructor(private readonly globalState: vscode.Memento) {}

    getFavorites(): Verse[] {
        return this.globalState.get<Verse[]>(this.favoritesKey, []);
    }

    isFavorite(verse: Verse): boolean {
        const favorites = this.getFavorites();
        return favorites.some((favorite) => favorite.reference === verse.reference);
    }

    addFavorite(verse: Verse): void {
        const favorites = this.getFavorites();

        if (this.isFavorite(verse)) {
            return;
        }

        favorites.push(verse);

        void this.globalState.update(this.favoritesKey, favorites);
    }

    removeFavorite(verse: Verse): void {
        const favorites = this.getFavorites();

        const updatedFavorites = favorites.filter(
            (favorite) => favorite.reference !== verse.reference
        );

        void this.globalState.update(this.favoritesKey, updatedFavorites);
    }

    toggleFavorite(verse: Verse): boolean {
        if (this.isFavorite(verse)) {
            this.removeFavorite(verse);

            return false;
        }

        this.addFavorite(verse);

        return true;
    }
}

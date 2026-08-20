import { describe, expect, it } from 'vitest';
import * as vscode from 'vscode';
import { Verse } from '../models/Verse';
import { FavoriteService } from './FavoriteService';

class FakeMemento implements vscode.Memento {
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

describe('FavoriteService', () => {
    it('should add a verse to favorites', async () => {
        const state = new FakeMemento();
        const service = new FavoriteService(state);
        const verse: Verse = {
            reference: 'João 3:16',
            text: 'Porque Deus amou o mundo...',
        };

        service.addFavorite(verse);

        const favorites = service.getFavorites();

        expect(favorites).toHaveLength(1);
        expect(favorites[0]).toMatchObject(verse);
        expect(favorites[0].favoritedAt).toEqual(expect.any(String));
    });

    it('should remove a verse from favorites', () => {
        const state = new FakeMemento();
        const service = new FavoriteService(state);
        const verse: Verse = {
            reference: 'João 3:16',
            text: 'Porque Deus amou o mundo...',
        };

        service.addFavorite(verse);

        service.removeFavorite(verse.reference);

        expect(service.getFavorites()).toHaveLength(0);
    });

    it('should toggle a favorite', () => {
        const state = new FakeMemento();
        const service = new FavoriteService(state);
        const verse: Verse = {
            reference: 'João 3:16',
            text: 'Porque Deus amou o mundo...',
        };

        const added = service.toggleFavorite(verse);

        expect(added).toBe(true);
        expect(service.isFavorite(verse)).toBe(true);

        const removed = service.toggleFavorite(verse);

        expect(removed).toBe(false);
        expect(service.isFavorite(verse)).toBe(false);
    });

    it('should notify listeners when favorites change', () => {
        const state = new FakeMemento();
        const service = new FavoriteService(state);
        const verse: Verse = {
            reference: 'João 3:16',
            text: 'Porque Deus amou o mundo...',
        };

        let notifications = 0;
        service.onDidChangeFavorites(() => {
            notifications++;
        });

        service.addFavorite(verse);
        service.removeFavorite(verse.reference);

        expect(notifications).toBe(2);
    });
});

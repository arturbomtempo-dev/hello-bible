import { describe, expect, it } from 'vitest';
import { BibleService } from './BibleService';

describe('BibleService', () => {
    it('should return a verse', () => {
        const service = new BibleService();

        const verse = service.getRandomVerse();

        expect(verse).toBeDefined();
        expect(verse.reference).toBeDefined();
        expect(verse.text).toBeDefined();
    });

    it('should return the same verse for the same day', () => {
        const service = new BibleService();

        const first = service.getDailyVerse();
        const second = service.getDailyVerse();

        expect(first).toEqual(second);
    });
});

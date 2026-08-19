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
});

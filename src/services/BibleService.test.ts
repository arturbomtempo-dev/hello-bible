import { describe, expect, it } from 'vitest';
import { BibleService } from './BibleService';
import { BibleTextFetcher } from './BibleApiClient';

class FakeBibleTextFetcher implements BibleTextFetcher {
    public readonly requestedReferences: string[] = [];

    async fetchVerseText(apiReference: string): Promise<string> {
        this.requestedReferences.push(apiReference);

        return `Texto de exemplo para ${apiReference}`;
    }
}

describe('BibleService', () => {
    it('should return a verse fetched through the api client', async () => {
        const fetcher = new FakeBibleTextFetcher();
        const service = new BibleService(fetcher);

        const verse = await service.getRandomVerse();

        expect(verse.reference).toBeDefined();
        expect(verse.text).toBeDefined();
        expect(fetcher.requestedReferences).toHaveLength(1);
    });

    it('should return the same verse for the same day without refetching', async () => {
        const fetcher = new FakeBibleTextFetcher();
        const service = new BibleService(fetcher);

        const first = await service.getDailyVerse();
        const second = await service.getDailyVerse();

        expect(first).toEqual(second);
        expect(fetcher.requestedReferences).toHaveLength(1);
    });

    it('should propagate errors from the api client', async () => {
        const failingFetcher: BibleTextFetcher = {
            fetchVerseText: async () => {
                throw new Error('network down');
            },
        };
        const service = new BibleService(failingFetcher);

        await expect(service.getDailyVerse()).rejects.toThrow('network down');
    });
});

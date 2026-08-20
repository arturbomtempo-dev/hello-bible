import { verseReferences } from '../data/verseReferences';
import { Verse, VerseReference } from '../models/Verse';
import { BibleApiClient, BibleTextFetcher } from './BibleApiClient';

export class BibleService {
    private currentReferenceIndex = -1;
    private cachedDaily?: { dateKey: string; verse: Verse };

    constructor(private readonly apiClient: BibleTextFetcher = new BibleApiClient()) {}

    async getRandomVerse(): Promise<Verse> {
        let index: number;

        do {
            index = Math.floor(Math.random() * verseReferences.length);
        } while (index === this.currentReferenceIndex && verseReferences.length > 1);

        this.currentReferenceIndex = index;

        return this.resolveVerse(verseReferences[index]);
    }

    async getDailyVerse(): Promise<Verse> {
        const dateKey = this.getDateKey(new Date());

        if (this.cachedDaily?.dateKey === dateKey) {
            return this.cachedDaily.verse;
        }

        const reference = verseReferences[this.getIndexFromDate(dateKey)];
        const verse = await this.resolveVerse(reference);

        this.cachedDaily = { dateKey, verse };

        return verse;
    }

    private async resolveVerse(reference: VerseReference): Promise<Verse> {
        const text = await this.apiClient.fetchVerseText(reference.apiReference);

        return { reference: reference.reference, text };
    }

    private getDateKey(date: Date): string {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    private getIndexFromDate(dateKey: string): number {
        let hash = 0;

        for (let i = 0; i < dateKey.length; i++) {
            hash = (hash << 5) - hash + dateKey.charCodeAt(i);

            hash |= 0;
        }

        return Math.abs(hash) % verseReferences.length;
    }
}

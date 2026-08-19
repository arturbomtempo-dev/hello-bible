import { verses } from '../data/verses';
import { Verse } from '../models/Verse';

export class BibleService {
    private currentVerseIndex = -1;

    getRandomVerse(): Verse {
        if (verses.length === 1) {
            return verses[0];
        }

        let index: number;

        do {
            index = Math.floor(Math.random() * verses.length);
        } while (index === this.currentVerseIndex);

        this.currentVerseIndex = index;

        return verses[index];
    }

    getDailyVerse(): Verse {
        const today = new Date();

        const dateKey =
            `${today.getFullYear()}-` + `${today.getMonth() + 1}-` + `${today.getDate()}`;

        const index = this.getIndexFromDate(dateKey);

        return verses[index];
    }

    private getIndexFromDate(dateKey: string): number {
        let hash = 0;

        for (let i = 0; i < dateKey.length; i++) {
            hash = (hash << 5) - hash + dateKey.charCodeAt(i);

            hash |= 0;
        }

        return Math.abs(hash) % verses.length;
    }
}

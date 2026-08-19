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
}

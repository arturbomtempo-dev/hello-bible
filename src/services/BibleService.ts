import { verses } from '../data/verses';
import { verse } from '../models/Verse';

export class BibleService {
    getRandomVerse(): verse {
        const index = Math.floor(Math.random() * verses.length);

        return verses[index];
    }
}

export interface Verse {
    reference: string;
    text: string;
}

export interface FavoriteVerse extends Verse {
    favoritedAt: string;
}

export interface VerseReference {
    reference: string;
    apiReference: string;
}

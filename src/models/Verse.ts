export interface Verse {
    reference: string;
    text: string;
}

export interface FavoriteVerse extends Verse {
    favoritedAt: string;
}

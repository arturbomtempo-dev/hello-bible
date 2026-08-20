import * as vscode from 'vscode';
import { Verse } from '../models/Verse';
import { AccentColorService } from '../services/AccentColorService';
import { BibleService } from '../services/BibleService';
import { FavoriteService } from '../services/FavoriteService';
import { getErrorPage, getLoadingPage, getVersePage } from '../webview/dailyVersePage';

export class BibleViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'hello-bible.view';

    constructor(
        private readonly bibleService: BibleService,
        private readonly favoriteService: FavoriteService,
        private readonly accentColorService: AccentColorService
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        webviewView.webview.options = {
            enableScripts: true,
        };

        let verse: Verse | undefined;

        const accentColor = () => this.accentColorService.getAccentColor();

        const renderVerse = () => {
            if (!verse) {
                return;
            }

            const isFavorite = this.favoriteService.isFavorite(verse);
            webviewView.webview.html = getVersePage(verse, isFavorite, accentColor());
        };

        const load = async () => {
            webviewView.webview.html = getLoadingPage(accentColor());

            try {
                verse = await this.bibleService.getDailyVerse();
                renderVerse();
            } catch {
                webviewView.webview.html = getErrorPage(accentColor());
            }
        };

        void load();

        const favoritesSubscription = this.favoriteService.onDidChangeFavorites(renderVerse);
        const accentColorSubscription = this.accentColorService.onDidChangeAccentColor(renderVerse);

        webviewView.onDidDispose(() => {
            favoritesSubscription.dispose();
            accentColorSubscription.dispose();
        });

        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'toggleFavorite' && verse) {
                this.favoriteService.toggleFavorite(verse);
            } else if (message.command === 'retry') {
                void load();
            }
        });
    }
}

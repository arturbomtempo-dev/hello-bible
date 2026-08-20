import * as vscode from 'vscode';
import { AccentColorService } from '../services/AccentColorService';
import { FavoriteService } from '../services/FavoriteService';
import { getFavoritesPage } from '../webview/favoritesPage';

export class FavoritesViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'hello-bible.favoritesView';

    constructor(
        private readonly favoriteService: FavoriteService,
        private readonly accentColorService: AccentColorService
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        webviewView.webview.options = {
            enableScripts: true,
        };

        const render = () => {
            webviewView.webview.html = getFavoritesPage(
                this.favoriteService.getFavorites(),
                this.accentColorService.getAccentColor()
            );
        };

        render();

        const favoritesSubscription = this.favoriteService.onDidChangeFavorites(render);
        const accentColorSubscription = this.accentColorService.onDidChangeAccentColor(render);

        webviewView.onDidDispose(() => {
            favoritesSubscription.dispose();
            accentColorSubscription.dispose();
        });

        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'removeFavorite' && typeof message.reference === 'string') {
                this.favoriteService.removeFavorite(message.reference);
            }
        });
    }
}

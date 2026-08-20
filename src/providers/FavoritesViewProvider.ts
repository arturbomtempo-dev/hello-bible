import * as vscode from 'vscode';
import { FavoriteVerse } from '../models/Verse';
import { AccentColorService } from '../services/AccentColorService';
import { FavoriteService } from '../services/FavoriteService';
import { getCompactSpacingTokens, getGhostButtonStyles, getThemeTokens } from '../webview/theme';

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
            webviewView.webview.html = this.getHtmlContent(this.favoriteService.getFavorites());
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

    private getHtmlContent(favorites: FavoriteVerse[]): string {
        const sorted = [...favorites].sort((a, b) => b.favoritedAt.localeCompare(a.favoritedAt));

        const body = sorted.length === 0 ? this.getEmptyStateHtml() : this.getListHtml(sorted);

        return `
            <!doctype html>
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Favoritos</title>

                    <style>
                        :root {
                            ${getThemeTokens(this.accentColorService.getAccentColor())}
                            ${getCompactSpacingTokens()}
                        }

                        * {
                            box-sizing: border-box;
                        }

                        html {
                            min-height: 100%;
                        }

                        body {
                            margin: 0;
                            min-height: 100%;
                            font-family: var(--font-sans);
                            font-size: 12px;
                            background-color: var(--bg);
                            background-image: var(--bg-glow);
                            color: var(--text-primary);
                            padding: var(--space-md) var(--space-sm);
                        }

                        .container {
                            width: 100%;
                            max-width: 320px;
                            margin: 0 auto;
                        }

                        .header {
                            display: flex;
                            align-items: center;
                            gap: var(--space-xs);
                            margin-bottom: var(--space-md);
                        }

                        .badge {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            min-width: 16px;
                            padding: 1px 6px;
                            font-family: var(--font-sans);
                            font-size: 10px;
                            font-weight: 700;
                            border-radius: 999px;
                            background: var(--vscode-badge-background, var(--accent-soft));
                            color: var(--vscode-badge-foreground, var(--accent));
                        }

                        .header-label {
                            font-family: var(--font-sans);
                            font-size: 9px;
                            font-weight: 600;
                            letter-spacing: 0.12em;
                            text-transform: uppercase;
                            color: var(--text-secondary);
                        }

                        .list {
                            display: flex;
                            flex-direction: column;
                            gap: var(--space-sm);
                        }

                        .favorite-card {
                            position: relative;
                            background: var(--card-bg);
                            border: 1px solid var(--border);
                            border-radius: var(--radius);
                            padding: var(--space-md) var(--space-sm);
                            animation: rise 0.3s ease-out;
                        }

                        body.vscode-high-contrast .favorite-card {
                            border-color: var(--vscode-contrastBorder, var(--border));
                        }

                        .favorite-card .quote-mark {
                            display: block;
                            font-family: var(--font-serif);
                            font-size: 18px;
                            line-height: 1;
                            color: var(--accent-soft);
                            margin-bottom: -0.2em;
                            user-select: none;
                        }

                        .favorite-card .verse {
                            font-family: var(--font-serif);
                            font-style: italic;
                            font-size: 12px;
                            line-height: 1.5;
                            color: var(--text-primary);
                            margin: 0 0 var(--space-sm);
                        }

                        .favorite-card .reference {
                            font-family: var(--font-sans);
                            font-size: 10px;
                            font-weight: 600;
                            letter-spacing: 0.06em;
                            text-transform: uppercase;
                            color: var(--accent);
                            margin: 0 0 2px;
                        }

                        .favorite-card .favorited-at {
                            font-family: var(--font-sans);
                            font-size: 9px;
                            color: var(--text-muted);
                            margin: 0 0 var(--space-sm);
                        }

                        ${getGhostButtonStyles()}

                        .favorite-card .ghost-btn {
                            padding: 3px 10px;
                            font-size: 9px;
                        }

                        .empty-state {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            text-align: center;
                            padding: var(--space-lg) var(--space-md);
                            background: var(--card-bg);
                            border: 1px solid var(--border);
                            border-radius: var(--radius);
                            animation: rise 0.3s ease-out;
                        }

                        body.vscode-high-contrast .empty-state {
                            border-color: var(--vscode-contrastBorder, var(--border));
                        }

                        .empty-state .icon {
                            width: clamp(16px, 6vw, 20px);
                            height: clamp(16px, 6vw, 20px);
                            margin: 0 auto var(--space-xs);
                            color: var(--accent);
                            opacity: 0.9;
                        }

                        .empty-state h2 {
                            font-family: var(--font-sans);
                            font-size: 11px;
                            font-weight: 600;
                            margin: 0 0 var(--space-xs);
                        }

                        .empty-state p {
                            font-family: var(--font-sans);
                            font-size: 10.5px;
                            line-height: 1.55;
                            color: var(--text-secondary);
                            margin: 0;
                        }

                        .empty-state strong {
                            color: var(--accent);
                            font-weight: 600;
                        }

                        @keyframes rise {
                            from {
                                opacity: 0;
                                transform: translateY(6px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        @media (prefers-reduced-motion: reduce) {
                            .favorite-card,
                            .empty-state {
                                animation: none;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="container">${body}</div>

                    <script>
                        const vscode = acquireVsCodeApi();

                        document.querySelectorAll('[data-remove-reference]').forEach((button) => {
                            button.addEventListener('click', () => {
                                vscode.postMessage({
                                    command: 'removeFavorite',
                                    reference: button.getAttribute('data-remove-reference'),
                                });
                            });
                        });
                    </script>
                </body>
            </html>
        `;
    }

    private getEmptyStateHtml(): string {
        return `
            <div class="empty-state">
                <svg
                    class="icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 6-5.2-2.9-5.2 2.9 1-6-4.3-4.2 5.9-.8L12 3.5Z" />
                </svg>
                <h2>Nenhum favorito ainda</h2>
                <p>
                    Os versículos que você favoritar vão aparecer aqui. Toque em
                    <strong>☆ Adicionar aos favoritos</strong> no versículo do dia para começar.
                </p>
            </div>
        `;
    }

    private getListHtml(favorites: FavoriteVerse[]): string {
        const items = favorites
            .map((favorite) => {
                const favoritedAt = new Date(favorite.favoritedAt).toLocaleDateString('pt-BR');

                return `
                    <div class="favorite-card">
                        <span class="quote-mark">&ldquo;</span>
                        <p class="verse">${favorite.text}</p>
                        <p class="reference">${favorite.reference}</p>
                        <p class="favorited-at">Favoritado em ${favoritedAt}</p>
                        <button
                            class="ghost-btn is-active"
                            type="button"
                            data-remove-reference="${favorite.reference}"
                        >
                            ✕ Remover
                        </button>
                    </div>
                `;
            })
            .join('');

        return `
            <div class="header">
                <span class="badge">${favorites.length}</span>
                <span class="header-label">Favoritos</span>
            </div>
            <div class="list">${items}</div>
        `;
    }
}

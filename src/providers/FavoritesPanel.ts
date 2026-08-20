import * as vscode from 'vscode';
import { FavoriteVerse } from '../models/Verse';
import { FavoriteService } from '../services/FavoriteService';
import { getGhostButtonStyles, getThemeTokens } from '../webview/theme';

export class FavoritesPanel {
    public static readonly viewType = 'hello-bible.favorites';
    private static currentPanel: FavoritesPanel | undefined;

    private readonly disposables: vscode.Disposable[] = [];

    static show(favoriteService: FavoriteService): void {
        const column = vscode.window.activeTextEditor?.viewColumn;

        if (FavoritesPanel.currentPanel) {
            FavoritesPanel.currentPanel.panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            FavoritesPanel.viewType,
            'Versículos Favoritos',
            column ?? vscode.ViewColumn.One,
            { enableScripts: true }
        );

        FavoritesPanel.currentPanel = new FavoritesPanel(panel, favoriteService);
    }

    private constructor(
        private readonly panel: vscode.WebviewPanel,
        private readonly favoriteService: FavoriteService
    ) {
        this.render();

        this.panel.webview.onDidReceiveMessage(
            (message) => {
                if (message.command === 'removeFavorite' && typeof message.reference === 'string') {
                    this.favoriteService.removeFavorite(message.reference);
                }
            },
            null,
            this.disposables
        );

        this.favoriteService.onDidChangeFavorites(() => this.render(), null, this.disposables);

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }

    private render(): void {
        this.panel.webview.html = this.getHtmlContent(this.favoriteService.getFavorites());
    }

    private dispose(): void {
        FavoritesPanel.currentPanel = undefined;

        while (this.disposables.length) {
            this.disposables.pop()?.dispose();
        }
    }

    private getHtmlContent(favorites: FavoriteVerse[]): string {
        const sorted = [...favorites].sort((a, b) => b.favoritedAt.localeCompare(a.favoritedAt));

        const body =
            sorted.length === 0 ? this.getEmptyStateHtml() : this.getFavoritesGridHtml(sorted);

        return `
            <!doctype html>
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Versículos Favoritos</title>

                    <style>
                        :root {
                            ${getThemeTokens()}

                            --space-xs: 8px;
                            --space-sm: 14px;
                            --space-md: 24px;
                            --space-lg: 40px;
                            --space-xl: 56px;

                            --radius: 14px;
                        }

                        * {
                            box-sizing: border-box;
                        }

                        html,
                        body {
                            min-height: 100%;
                        }

                        body {
                            margin: 0;
                            font-family: var(--font-sans);
                            background-color: var(--bg);
                            background-image: var(--bg-glow);
                            color: var(--text-primary);
                            padding: var(--space-xl) var(--space-lg) var(--space-lg);
                        }

                        .page {
                            max-width: 980px;
                            margin: 0 auto;
                        }

                        .page-header {
                            text-align: center;
                            margin-bottom: var(--space-xl);
                        }

                        .page-header .icon {
                            width: 30px;
                            height: 30px;
                            margin: 0 auto var(--space-sm);
                            color: var(--accent);
                            opacity: 0.9;
                        }

                        .page-header h1 {
                            font-family: var(--font-sans);
                            font-size: 18px;
                            font-weight: 600;
                            margin: 0 0 6px;
                        }

                        .page-header p {
                            font-family: var(--font-sans);
                            font-size: 13px;
                            color: var(--text-secondary);
                            margin: 0;
                        }

                        .grid {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                            gap: var(--space-md);
                            animation: rise 0.4s ease-out;
                        }

                        .favorite-card {
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            background: var(--card-bg);
                            border: 1px solid var(--border);
                            border-radius: var(--radius);
                            padding: var(--space-md);
                            box-shadow: 0 10px 24px -16px var(--shadow);
                        }

                        body.vscode-high-contrast .favorite-card {
                            border-color: var(--vscode-contrastBorder, var(--border));
                        }

                        .favorite-card .quote-mark {
                            display: block;
                            font-family: var(--font-serif);
                            font-size: 30px;
                            line-height: 1;
                            color: var(--accent-soft);
                            margin-bottom: -0.2em;
                            user-select: none;
                        }

                        .favorite-card .verse {
                            font-family: var(--font-serif);
                            font-style: italic;
                            font-size: 15px;
                            line-height: 1.55;
                            color: var(--text-primary);
                            margin: 0 0 var(--space-md);
                            flex: 1;
                        }

                        .favorite-card .meta {
                            margin-bottom: var(--space-sm);
                        }

                        .favorite-card .reference {
                            font-family: var(--font-sans);
                            font-size: 12px;
                            font-weight: 600;
                            letter-spacing: 0.06em;
                            text-transform: uppercase;
                            color: var(--accent);
                            margin: 0 0 4px;
                        }

                        .favorite-card .favorited-at {
                            font-family: var(--font-sans);
                            font-size: 11px;
                            color: var(--text-muted);
                            margin: 0;
                        }

                        .favorite-card .ghost-btn {
                            align-self: flex-start;
                        }

                        ${getGhostButtonStyles()}

                        .empty-state {
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            text-align: center;
                            max-width: 360px;
                            margin: var(--space-xl) auto 0;
                            padding: var(--space-xl) var(--space-lg);
                            background: var(--card-bg);
                            border: 1px solid var(--border);
                            border-radius: var(--radius);
                            box-shadow: 0 10px 24px -16px var(--shadow);
                            animation: rise 0.4s ease-out;
                        }

                        body.vscode-high-contrast .empty-state {
                            border-color: var(--vscode-contrastBorder, var(--border));
                        }

                        .empty-state .icon {
                            width: 30px;
                            height: 30px;
                            margin-bottom: var(--space-sm);
                            color: var(--accent);
                            opacity: 0.9;
                        }

                        .empty-state h2 {
                            font-family: var(--font-sans);
                            font-size: 14px;
                            font-weight: 600;
                            margin: 0 0 var(--space-xs);
                        }

                        .empty-state p {
                            font-family: var(--font-sans);
                            font-size: 13px;
                            line-height: 1.6;
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
                                transform: translateY(10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        @media (prefers-reduced-motion: reduce) {
                            .grid,
                            .empty-state {
                                animation: none;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="page">
                        <div class="page-header">
                            <svg
                                class="icon"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="1.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path
                                    d="M12 6.5c-1.6-1.4-4-2-6.5-2-.6 0-1 .43-1 1v11.5c0 .55.44 1 1 1 2.3 0 4.6.5 6.5 1.8 1.9-1.3 4.2-1.8 6.5-1.8.56 0 1-.45 1-1V5.5c0-.57-.44-1-1-1-2.5 0-4.9.6-6.5 2Z"
                                />
                                <path d="M12 6.5v13" />
                            </svg>
                            <h1>Versículos Favoritos</h1>
                            <p>Sua coleção pessoal de passagens guardadas para ler novamente.</p>
                        </div>

                        ${body}
                    </div>

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
                    <strong>☆ Adicionar aos favoritos</strong> no versículo do dia para começar sua
                    coleção.
                </p>
            </div>
        `;
    }

    private getFavoritesGridHtml(favorites: FavoriteVerse[]): string {
        const cards = favorites
            .map((favorite) => {
                const favoritedAt = new Date(favorite.favoritedAt).toLocaleDateString('pt-BR');

                return `
                    <div class="favorite-card">
                        <span class="quote-mark">&ldquo;</span>
                        <p class="verse">${favorite.text}</p>
                        <div class="meta">
                            <p class="reference">${favorite.reference}</p>
                            <p class="favorited-at">Favoritado em ${favoritedAt}</p>
                        </div>
                        <button
                            class="ghost-btn is-active"
                            type="button"
                            data-remove-reference="${favorite.reference}"
                        >
                            ★ Remover dos favoritos
                        </button>
                    </div>
                `;
            })
            .join('');

        return `<div class="grid">${cards}</div>`;
    }
}

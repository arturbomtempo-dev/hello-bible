import * as vscode from 'vscode';
import { Verse } from '../models/Verse';
import { BibleService } from '../services/BibleService';
import { FavoriteService } from '../services/FavoriteService';
import { getCompactSpacingTokens, getGhostButtonStyles, getThemeTokens } from '../webview/theme';

export class BibleViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'hello-bible.view';

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly bibleService: BibleService,
        private readonly favoriteService: FavoriteService
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        const verse = this.bibleService.getDailyVerse();

        webviewView.webview.options = {
            enableScripts: true,
        };

        const render = () => {
            const isFavorite = this.favoriteService.isFavorite(verse);
            webviewView.webview.html = this.getHtmlContent(verse, isFavorite);
        };

        render();

        const changeSubscription = this.favoriteService.onDidChangeFavorites(render);

        webviewView.onDidDispose(() => changeSubscription.dispose());

        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'toggleFavorite') {
                this.favoriteService.toggleFavorite(verse);
            }
        });
    }

    private getHtmlContent(verse: Verse, isFavorite: boolean): string {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('pt-BR');

        return `
            <!doctype html>
            <html lang="pt-BR">
                <head>
                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Palavra do Dia</title>

                    <style>
                        :root {
                            ${getThemeTokens()}
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

                        .card {
                            position: relative;
                            background: var(--card-bg);
                            border: 1px solid var(--border);
                            border-radius: var(--radius);
                            padding: var(--space-lg) var(--space-md);
                            text-align: center;
                            box-shadow: 0 4px 14px -8px var(--shadow);
                            animation: rise 0.4s ease-out;
                        }

                        .card::before {
                            content: '';
                            position: absolute;
                            top: -1px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: min(80px, 45%);
                            height: 1px;
                            background: linear-gradient(90deg, transparent, var(--accent-line), transparent);
                        }

                        body.vscode-high-contrast .card {
                            border-color: var(--vscode-contrastBorder, var(--border));
                        }

                        .icon {
                            width: clamp(14px, 5vw, 18px);
                            height: clamp(14px, 5vw, 18px);
                            margin: 0 auto var(--space-xs);
                            color: var(--accent);
                            opacity: 0.9;
                        }

                        .eyebrow {
                            font-family: var(--font-sans);
                            font-size: clamp(8px, 2.2vw, 9px);
                            font-weight: 600;
                            letter-spacing: 0.14em;
                            text-transform: uppercase;
                            color: var(--text-secondary);
                            margin: 0 0 var(--space-md);
                        }

                        .verse-wrap {
                            position: relative;
                            margin-bottom: var(--space-md);
                        }

                        .quote-mark {
                            display: block;
                            font-family: var(--font-serif);
                            font-size: clamp(18px, 7vw, 24px);
                            line-height: 1;
                            color: var(--accent-soft);
                            margin-bottom: -0.2em;
                            user-select: none;
                        }

                        .verse {
                            font-family: var(--font-serif);
                            font-style: italic;
                            font-size: clamp(11px, 3.6vw, 13px);
                            line-height: 1.5;
                            color: var(--text-primary);
                            margin: 0;
                        }

                        .divider {
                            width: 20px;
                            height: 2px;
                            background: var(--accent);
                            border-radius: 2px;
                            margin: 0 auto var(--space-xs);
                            opacity: 0.8;
                        }

                        .reference {
                            font-family: var(--font-sans);
                            font-size: clamp(9px, 2.8vw, 10px);
                            font-weight: 600;
                            letter-spacing: 0.06em;
                            text-transform: uppercase;
                            color: var(--accent);
                            margin: 0;
                        }

                        .date {
                            font-family: var(--font-sans);
                            font-size: clamp(8px, 2.2vw, 9px);
                            font-weight: 500;
                            letter-spacing: 0.03em;
                            color: var(--text-muted);
                            margin: var(--space-sm) 0 0;
                            text-align: right;
                        }

                        ${getGhostButtonStyles()}

                        .ghost-btn {
                            margin-top: var(--space-sm);
                            padding: 3px 10px;
                            font-size: clamp(8px, 2.2vw, 9px);
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
                            .card {
                                animation: none;
                            }
                        }
                    </style>
                </head>

                <body>
                    <div class="container">
                        <div class="card">
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

                            <p class="eyebrow">Palavra do Dia</p>

                            <div class="verse-wrap">
                                <span class="quote-mark">&ldquo;</span>
                                <p id="verse" class="verse">
                                    ${verse.text}
                                </p>
                            </div>

                            <div class="divider"></div>
                            <p id="reference" class="reference">${verse.reference}</p>

                            <button
                                id="favoriteButton"
                                class="ghost-btn${isFavorite ? ' is-active' : ''}"
                                type="button"
                            >
                                ${isFavorite ? '★ Favoritado' : '☆ Adicionar aos favoritos'}
                            </button>

                            <p class="date">${formattedDate}</p>
                        </div>
                    </div>

                    <script>
                        const vscode = acquireVsCodeApi();
                        const favoriteButton = document.getElementById('favoriteButton');

                        favoriteButton.addEventListener('click', () => {
                            vscode.postMessage({ command: 'toggleFavorite' });
                        });
                    </script>
                </body>
            </html>
        `;
    }
}

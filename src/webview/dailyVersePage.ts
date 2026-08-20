import { Verse } from '../models/Verse';
import { escapeHtml } from '../utils/html';
import {
    getBasePageStyles,
    getCompactSpacingTokens,
    getGhostButtonStyles,
    getThemeTokens,
} from './theme';

function getBookIconSvg(extraClass = ''): string {
    return `
        <svg
            class="icon ${extraClass}"
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
    `;
}

function getWarningIconSvg(): string {
    return `
        <svg
            class="icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path
                d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
            />
        </svg>
    `;
}

function getStyles(accentColor: string | undefined): string {
    return `
        :root {
            ${getThemeTokens(accentColor)}
            ${getCompactSpacingTokens()}
        }

        ${getBasePageStyles()}

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

        .icon.is-loading {
            animation: pulse 1.4s ease-in-out infinite;
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

        .status-text {
            font-family: var(--font-sans);
            font-size: 10px;
            color: var(--text-secondary);
            margin: 0;
        }

        .status-text.is-error {
            margin-bottom: var(--space-sm);
            line-height: 1.5;
        }

        ${getGhostButtonStyles()}

        .ghost-btn {
            margin-top: var(--space-sm);
            padding: 3px 10px;
            font-size: clamp(8px, 2.2vw, 9px);
        }

        @keyframes pulse {
            0%,
            100% {
                opacity: 0.35;
            }
            50% {
                opacity: 0.9;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .card,
            .icon.is-loading {
                animation: none;
            }
        }
    `;
}

function getScript(): string {
    return `
        const vscode = acquireVsCodeApi();

        const favoriteButton = document.getElementById('favoriteButton');
        favoriteButton?.addEventListener('click', () => {
            vscode.postMessage({ command: 'toggleFavorite' });
        });

        const retryButton = document.getElementById('retryButton');
        retryButton?.addEventListener('click', () => {
            vscode.postMessage({ command: 'retry' });
        });
    `;
}

function getShell(accentColor: string | undefined, bodyHtml: string): string {
    return `
        <!doctype html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Palavra do Dia</title>

                <style>${getStyles(accentColor)}</style>
            </head>

            <body>
                <div class="container">${bodyHtml}</div>

                <script>${getScript()}</script>
            </body>
        </html>
    `;
}

export function getLoadingPage(accentColor?: string): string {
    const body = `
        <div class="card">
            ${getBookIconSvg('is-loading')}
            <p class="status-text">Carregando versículo do dia&hellip;</p>
        </div>
    `;

    return getShell(accentColor, body);
}

export function getErrorPage(accentColor?: string): string {
    const body = `
        <div class="card">
            ${getWarningIconSvg()}
            <p class="status-text is-error">
                Não foi possível carregar o versículo do dia. Verifique sua conexão com a
                internet.
            </p>
            <button id="retryButton" class="ghost-btn" type="button">
                <svg
                    class="btn-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                    <path d="M21 3v6h-6" />
                </svg>
                Tentar novamente
            </button>
        </div>
    `;

    return getShell(accentColor, body);
}

export function getVersePage(verse: Verse, isFavorite: boolean, accentColor?: string): string {
    const formattedDate = new Date().toLocaleDateString('pt-BR');

    const body = `
        <div class="card">
            ${getBookIconSvg()}

            <p class="eyebrow">Palavra do Dia</p>

            <div class="verse-wrap">
                <span class="quote-mark">&ldquo;</span>
                <p id="verse" class="verse">
                    ${escapeHtml(verse.text)}
                </p>
            </div>

            <div class="divider"></div>
            <p id="reference" class="reference">${escapeHtml(verse.reference)}</p>

            <button
                id="favoriteButton"
                class="ghost-btn${isFavorite ? ' is-active' : ''}"
                type="button"
            >
                ${isFavorite ? '★ Favoritado' : '☆ Adicionar aos favoritos'}
            </button>

            <p class="date">${formattedDate}</p>
        </div>
    `;

    return getShell(accentColor, body);
}

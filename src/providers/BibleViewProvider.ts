import * as vscode from 'vscode';
import { Verse } from '../models/Verse';
import { BibleService } from '../services/BibleService';

export class BibleViewProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'hello-bible.view';

    constructor(
        private readonly extensionUri: vscode.Uri,
        private readonly bibleService: BibleService
    ) {}

    resolveWebviewView(webviewView: vscode.WebviewView): void {
        const verse = this.bibleService.getDailyVerse();

        webviewView.webview.options = {
            enableScripts: true,
        };

        webviewView.webview.html = this.getHtmlContent(verse);
    }

    private getHtmlContent(verse: Verse): string {
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
                            --bg: var(--vscode-editor-background, #1e1e1e);
                            --card-bg: var(--vscode-editorWidget-background, #252526);
                            --border: var(
                                --vscode-widget-border,
                                var(--vscode-panel-border, rgba(128, 128, 128, 0.35))
                            );
                            --shadow: var(--vscode-widget-shadow, rgba(0, 0, 0, 0.36));

                            --text-primary: var(--vscode-editor-foreground, var(--vscode-foreground, #cccccc));
                            --text-secondary: var(--vscode-descriptionForeground, #9d9d9d);
                            --text-muted: var(--vscode-disabledForeground, #6b6b6b);

                            --accent: var(--vscode-textLink-foreground, #d9b26b);
                            --accent-soft: color-mix(in srgb, var(--accent) 14%, transparent);
                            --accent-line: color-mix(in srgb, var(--accent) 35%, transparent);
                            --bg-glow: radial-gradient(
                                circle at 50% 0%,
                                color-mix(in srgb, var(--accent) 8%, transparent),
                                transparent 55%
                            );

                            --font-serif:
                                Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif;
                            --font-sans: var(
                                --vscode-font-family,
                                -apple-system,
                                BlinkMacSystemFont,
                                'Segoe UI',
                                system-ui,
                                sans-serif
                            );

                            --space-xs: 8px;
                            --space-sm: 14px;
                            --space-md: 24px;
                            --space-lg: 40px;
                            --space-xl: 56px;

                            --radius: 18px;
                        }

                        * {
                            box-sizing: border-box;
                        }

                        html,
                        body {
                            height: 100%;
                        }

                        body {
                            margin: 0;
                            font-family: var(--font-sans);
                            background-color: var(--bg);
                            background-image: var(--bg-glow);
                            color: var(--text-primary);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: var(--space-lg) var(--space-md);
                        }

                        .container {
                            width: 100%;
                            max-width: 620px;
                        }

                        .card {
                            position: relative;
                            background: var(--card-bg);
                            border: 1px solid var(--border);
                            border-radius: var(--radius);
                            padding: var(--space-xl) var(--space-lg);
                            text-align: center;
                            box-shadow: 0 24px 60px -20px var(--shadow);
                            animation: rise 0.5s ease-out;
                        }

                        .card::before {
                            content: '';
                            position: absolute;
                            top: -1px;
                            left: 50%;
                            transform: translateX(-50%);
                            width: 120px;
                            height: 1px;
                            background: linear-gradient(90deg, transparent, var(--accent-line), transparent);
                        }

                        body.vscode-high-contrast .card {
                            border-color: var(--vscode-contrastBorder, var(--border));
                        }

                        .icon {
                            width: 30px;
                            height: 30px;
                            margin: 0 auto var(--space-sm);
                            color: var(--accent);
                            opacity: 0.9;
                        }

                        .eyebrow {
                            font-family: var(--font-sans);
                            font-size: 11px;
                            font-weight: 600;
                            letter-spacing: 0.18em;
                            text-transform: uppercase;
                            color: var(--text-secondary);
                            margin: 0 0 var(--space-lg);
                        }

                        .verse-wrap {
                            position: relative;
                            margin-bottom: var(--space-lg);
                        }

                        .quote-mark {
                            display: block;
                            font-family: var(--font-serif);
                            font-size: 64px;
                            line-height: 1;
                            color: var(--accent-soft);
                            margin-bottom: -18px;
                            user-select: none;
                        }

                        .verse {
                            font-family: var(--font-serif);
                            font-style: italic;
                            font-size: 22px;
                            line-height: 1.65;
                            color: var(--text-primary);
                            margin: 0;
                        }

                        .divider {
                            width: 36px;
                            height: 2px;
                            background: var(--accent);
                            border-radius: 2px;
                            margin: 0 auto var(--space-sm);
                            opacity: 0.8;
                        }

                        .reference {
                            font-family: var(--font-sans);
                            font-size: 13px;
                            font-weight: 600;
                            letter-spacing: 0.08em;
                            text-transform: uppercase;
                            color: var(--accent);
                            margin: 0;
                        }

                        .date {
                            font-family: var(--font-sans);
                            font-size: 11px;
                            font-weight: 500;
                            letter-spacing: 0.04em;
                            color: var(--text-muted);
                            margin: var(--space-md) 0 0;
                            text-align: right;
                        }

                        .new-verse-btn {
                            display: inline-flex;
                            align-items: center;
                            gap: 8px;
                            margin-top: var(--space-lg);
                            padding: 10px 22px;
                            font-family: var(--font-sans);
                            font-size: 12px;
                            font-weight: 600;
                            letter-spacing: 0.06em;
                            text-transform: uppercase;
                            color: var(--accent);
                            background: transparent;
                            border: 1px solid var(--accent-line);
                            border-radius: 999px;
                            cursor: pointer;
                            transition:
                                background-color 0.15s ease,
                                border-color 0.15s ease,
                                transform 0.1s ease;
                        }

                        .new-verse-btn .btn-icon {
                            width: 14px;
                            height: 14px;
                        }

                        .new-verse-btn:hover {
                            background: var(--accent-soft);
                            border-color: var(--accent);
                        }

                        .new-verse-btn:active {
                            transform: scale(0.96);
                        }

                        .new-verse-btn:focus-visible {
                            outline: 2px solid var(--vscode-focusBorder, var(--accent));
                            outline-offset: 2px;
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

                        @media (max-width: 420px) {
                            .card {
                                padding: var(--space-lg) var(--space-md);
                            }
                            .verse {
                                font-size: 19px;
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

                            <p class="date">${formattedDate}</p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    }
}

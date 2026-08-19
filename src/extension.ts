import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const showVerseCommand = vscode.commands.registerCommand('hello-bible.showVerse', () => {
        showVerse();
    });

    context.subscriptions.push(showVerseCommand);
}

function showVerse() {
    const panel = vscode.window.createWebviewPanel(
        'helloBible',
        'Hello Bible',
        vscode.ViewColumn.One,
        {}
    );

    panel.webview.html = getWebviewContent();
}

function getWebviewContent(): string {
    return `
        <!doctype html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Palavra do Dia</title>

                <style>
                    :root {
                        --bg: #0e0f14;
                        --bg-glow: radial-gradient(
                            circle at 50% 0%,
                            rgba(122, 143, 255, 0.08),
                            transparent 55%
                        );
                        --card-bg: linear-gradient(180deg, #171925 0%, #14151e 100%);
                        --border: rgba(255, 255, 255, 0.07);
                        --border-strong: rgba(217, 178, 107, 0.25);

                        --text-primary: #ece9f7;
                        --text-secondary: #8f8ca3;
                        --text-muted: #605d72;

                        --accent: #d9b26b;
                        --accent-soft: rgba(217, 178, 107, 0.14);
                        --accent-line: rgba(217, 178, 107, 0.35);
                        --accent-secondary: #7c8fff;

                        --font-serif:
                            Georgia, 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', serif;
                        --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;

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
                        box-shadow:
                            0 24px 60px -20px rgba(0, 0, 0, 0.55),
                            0 0 0 1px rgba(255, 255, 255, 0.02) inset;
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
                        background: linear-gradient(90deg, transparent, var(--border-strong), transparent);
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
                            <p class="verse">
                                Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para
                                que todo aquele que nele crê não pereça, mas tenha a vida eterna.
                            </p>
                        </div>

                        <div class="divider"></div>
                        <p class="reference">João 3:16</p>
                    </div>
                </div>
            </body>
        </html>
    `;
}

export function deactivate() {}

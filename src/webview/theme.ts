const hexColorPattern = /^#[0-9a-fA-F]{3,8}$/;

export function getThemeTokens(accentColor?: string): string {
    const accent =
        accentColor && hexColorPattern.test(accentColor)
            ? accentColor
            : 'var(--vscode-textLink-foreground, #d9b26b)';

    return `
        --bg: var(--vscode-editor-background, #1e1e1e);
        --card-bg: var(--vscode-editorWidget-background, #252526);
        --shadow: var(--vscode-widget-shadow, rgba(0, 0, 0, 0.36));

        --text-primary: var(--vscode-editor-foreground, var(--vscode-foreground, #cccccc));
        --text-secondary: var(--vscode-descriptionForeground, #9d9d9d);
        --text-muted: var(--vscode-disabledForeground, #6b6b6b);

        --accent: ${accent};
        --accent-soft: color-mix(in srgb, var(--accent) 14%, transparent);
        --accent-line: color-mix(in srgb, var(--accent) 35%, transparent);
        --border: color-mix(in srgb, var(--accent) 55%, transparent);
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
    `;
}

export function getCompactSpacingTokens(): string {
    return `
        --space-xs: clamp(4px, 1.5vw, 6px);
        --space-sm: clamp(6px, 2.5vw, 10px);
        --space-md: clamp(8px, 3.5vw, 14px);
        --space-lg: clamp(12px, 5vw, 20px);
        --space-xl: clamp(16px, 6.5vw, 26px);

        --radius: 10px;
    `;
}

export function getGhostButtonStyles(): string {
    return `
        .ghost-btn {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 12px;
            font-family: var(--font-sans);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.04em;
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

        .ghost-btn:hover {
            background: var(--accent-soft);
            border-color: var(--accent);
        }

        .ghost-btn:active {
            transform: scale(0.96);
        }

        .ghost-btn:focus-visible {
            outline: 2px solid var(--vscode-focusBorder, var(--accent));
            outline-offset: 2px;
        }

        .ghost-btn.is-active {
            background: var(--accent-soft);
            border-color: var(--accent);
        }
    `;
}

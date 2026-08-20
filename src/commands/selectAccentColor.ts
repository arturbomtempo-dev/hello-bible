import * as vscode from 'vscode';
import { accentColors } from '../data/accentColors';
import { AccentColorService } from '../services/AccentColorService';

interface AccentColorQuickPickItem extends vscode.QuickPickItem {
    colorValue: string | undefined;
}

function getColorSwatchIcon(hex: string): vscode.Uri {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="8" cy="8" r="6" fill="${hex}" /></svg>`;

    return vscode.Uri.parse(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
}

export function registerSelectAccentColorCommand(
    context: vscode.ExtensionContext,
    accentColorService: AccentColorService
): void {
    const command = vscode.commands.registerCommand('hello-bible.selectAccentColor', async () => {
        const currentColor = accentColorService.getAccentColor();

        const items: AccentColorQuickPickItem[] = accentColors.map((option) => ({
            label: option.label,
            description: option.color === currentColor ? '(atual)' : undefined,
            iconPath: option.color
                ? getColorSwatchIcon(option.color)
                : new vscode.ThemeIcon('circle-outline'),
            colorValue: option.color,
        }));

        const picked = await vscode.window.showQuickPick(items, {
            title: 'Cor de destaque - Hello Bible',
            placeHolder: 'Escolha a cor usada no versículo do dia e nos favoritos',
        });

        if (picked) {
            accentColorService.setAccentColor(picked.colorValue);
        }
    });

    context.subscriptions.push(command);
}

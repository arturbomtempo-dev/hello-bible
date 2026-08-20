export interface AccentColorOption {
    id: string;
    label: string;
    color?: string;
}

export const accentColors: AccentColorOption[] = [
    { id: 'default', label: 'Padrão (tema do editor)', color: undefined },
    { id: 'gold', label: 'Dourado', color: '#d9b26b' },
    { id: 'blue', label: 'Azul', color: '#5b9bd5' },
    { id: 'green', label: 'Verde', color: '#4caf82' },
    { id: 'teal', label: 'Turquesa', color: '#4fc1c9' },
    { id: 'purple', label: 'Roxo', color: '#a78bfa' },
    { id: 'pink', label: 'Rosa', color: '#e08bb0' },
    { id: 'red', label: 'Vermelho', color: '#e2726b' },
];

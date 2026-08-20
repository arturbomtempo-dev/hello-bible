export interface Disposable {
    dispose(): void;
}

export class Emitter<T> {
    private readonly listeners = new Set<(value: T) => void>();

    readonly event = (
        listener: (value: T) => void,
        thisArgs?: unknown,
        disposables?: Disposable[]
    ): Disposable => {
        const boundListener = thisArgs ? listener.bind(thisArgs) : listener;

        this.listeners.add(boundListener);

        const disposable: Disposable = {
            dispose: () => {
                this.listeners.delete(boundListener);
            },
        };

        disposables?.push(disposable);

        return disposable;
    };

    fire(value: T): void {
        this.listeners.forEach((listener) => listener(value));
    }

    dispose(): void {
        this.listeners.clear();
    }
}

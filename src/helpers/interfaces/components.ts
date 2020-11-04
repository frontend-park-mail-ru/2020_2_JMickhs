export interface AbstractComponent {
    activate(...args: unknown[]): void;
    deactivate(): void;
}

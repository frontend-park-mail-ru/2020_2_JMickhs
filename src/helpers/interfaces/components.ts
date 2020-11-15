export interface AbstractComponent {
    activate(...args: unknown[]): void;
    setPlace(place: HTMLDivElement): void;
    deactivate(): void;
}

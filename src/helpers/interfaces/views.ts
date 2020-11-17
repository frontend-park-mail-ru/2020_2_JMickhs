export interface AbstractView {
    render(data: unknown): void;
    hide(): void;
}

export abstract class PageView implements AbstractView {
    protected page: HTMLElement;

    constructor(place: HTMLElement) {
        this.page = place;
    }

    abstract render(data: unknown): void;

    abstract hide(): void;
}

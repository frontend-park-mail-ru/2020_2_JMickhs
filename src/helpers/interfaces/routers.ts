export interface AbstractRouter {
    pushState(url: string, state?: unknown): void,
    canBack(): boolean,
    goBack(): void,
}

export interface AbstractController {
    activate(arg?: unknown): void;
    deactivate(): void;
}

export interface PageController extends AbstractController {
    activate(params?: URLSearchParams): void;
    deactivate(): void;
    updateParams?(params: URLSearchParams): void;
}

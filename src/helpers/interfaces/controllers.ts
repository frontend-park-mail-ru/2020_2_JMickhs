export interface AbstractController {
    activate(arg?: unknown): void;
    deactivate(): void;
}

export interface PageController extends AbstractController {
    updateParams?(params: URLSearchParams): void;
}

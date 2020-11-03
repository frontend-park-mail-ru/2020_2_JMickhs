export interface AbstractController {
    activate(arg: unknown): void;
    deactivate(): void;
    updateParams?(urlStr: string): void;
}

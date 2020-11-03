import ErrorPageView from '@pageError/errorPageView';

export default class ErrorPageController {
    private view: ErrorPageView;

    constructor(parent: HTMLElement) {
        this.view = new ErrorPageView(parent);
    }

    activate(): void {
        const errText = window.history.state;

        this.view.render(errText);
    }

    deactivate(): void {
        this.view.hide();
    }
}

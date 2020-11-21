import ErrorPageView from '@/components/page-error/page-error-view';

export default class ErrorPageController {
    private view: ErrorPageView;

    constructor(place: HTMLElement) {
        this.view = new ErrorPageView(place);
    }

    activate(): void {
        const errText = window.history.state;

        this.view.render(errText);
    }

    deactivate(): void {
        this.view.hide();
    }
}

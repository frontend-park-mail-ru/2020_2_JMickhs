import ErrorPageView from '@pageError/errorPageView';
import Events from '@eventBus/eventbus';
import {NAVBAR_ACTIVE} from '@eventBus/constants';

export default class ErrorPageController {

    private view: ErrorPageView;

    constructor(parent: HTMLElement) {
        this.view = new ErrorPageView(parent);
    }

    activate(): void {
        Events.trigger(NAVBAR_ACTIVE, -1);

        const errText = history.state;

        this.view.render(errText);
    }

    deactivate(): void {
        this.view.hide();
    }
}
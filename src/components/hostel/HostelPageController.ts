import HostelPageModel from '@hostel/hostelPageModel';
import HostelPageView from '@hostel/hostelPageView';
import Events from '@eventBus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@eventBus/constants';
import Redirector from '@router/redirector';

import { PageController } from '@interfaces/controllers';
import { HandlerEvent } from '@interfaces/functions';

export default class HostelPageController implements PageController {
    private model: HostelPageModel;

    private view: HostelPageView;

    private handlers: Record<string, HandlerEvent>;

    constructor(parent: HTMLElement) {
        this.model = new HostelPageModel();
        this.view = new HostelPageView(parent);

        this.handlers = this.makeHandlers();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            renderView: this.view.render.bind(this.view),
        };
    }

    activate(id: number): void {
        if (id <= 0) {
            Redirector.redirectError('Такого отеля не существует');
            return;
        }

        Events.subscribe(UPDATE_HOSTEL, this.handlers.renderView);

        this.model.fillModel(id);
    }

    deactivate(): void {
        Events.unsubscribe(UPDATE_HOSTEL, this.handlers.renderView);
        this.view.hide();
    }
}

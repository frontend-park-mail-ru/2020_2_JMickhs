import HostelPageModel from '@hostel/hostelPageModel';
import HostelPageView from '@hostel/hostelPageView';
import Events from '@eventBus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@eventBus/constants';
import Redirector from '@/helpers/router/redirector';

import { PageController } from '@/helpers/interfaces/controllers';
import { Handler } from '@/helpers/interfaces/functions';

export default class HostelPageController implements PageController {
    private model: HostelPageModel;

    private view: HostelPageView;

    private handlers: Record<string, Handler>;

    constructor(parent: HTMLElement) {
        this.model = new HostelPageModel();
        this.view = new HostelPageView(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, Handler> {
        const handlers = {
            renderView: this.view.render.bind(this.view),
        };
        return handlers;
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

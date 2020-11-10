import HostelPageModel from '@/components/hostel/hostel-page-model';
import HostelPageView from '@/components/hostel/hostel-page-view';
import Events from '@evenbus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@evenbus/constants';
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

    activate(params?: URLSearchParams): void {
        if (!params) {
            Redirector.redirectError('Такого отеля не существует');
        }

        const id = Number(params?.get('id'));
        if (!id || id <= 0) {
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

import HostelPageModel from '@hostel/hostelPageModel';
import HostelPageView from '@hostel/hostelPageView';
import Events from '@eventBus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@eventBus/constants';
import Redirector from '@/helpers/router/redirector';

import { HostelData } from '@interfaces/structsData/hostelData';
import { PageController } from '@/helpers/interfaces/controllers';

interface Handlers {
    renderView: (data: HostelData) => void,
}

export default class HostelPageController implements PageController {
    private model: HostelPageModel;

    private view: HostelPageView;

    private hadlers: Handlers;

    constructor(parent: HTMLElement) {
        this.model = new HostelPageModel();
        this.view = new HostelPageView(parent);

        this.hadlers = this.makeHadlers();
    }

    private makeHadlers(): Handlers {
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

        Events.subscribe(UPDATE_HOSTEL, this.hadlers.renderView);

        this.model.fillModel(id);
    }

    deactivate(): void {
        Events.unsubscribe(UPDATE_HOSTEL, this.hadlers.renderView);
        this.view.hide();
    }
}

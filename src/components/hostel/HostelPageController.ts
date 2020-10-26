import HostelPageModel from '@hostel/hostelPageModel';
import HostelPageView from '@hostel/hostelPageView';
import Events from '@eventBus/eventbus';
import {
    REDIRECT_ERROR,
    UPDATE_HOSTEL,
} from '@eventBus/constants';

import {HostelData} from '@interfaces/hostelData';

interface Handlers {
    renderView: (data: HostelData) => void,
}

export default class HostelPageController {

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
        }
        return handlers;
    }

    activate(id: number): void {
        if (id <= 0) {
            Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Такого отеля не существует'});
        }

        if (this.model.haveHostel(id)) {
            const data = this.model.getData();
            this.view.render(data);
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
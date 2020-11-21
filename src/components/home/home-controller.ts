import HomeModel from '@home/home-model';
import HomeView from '@home/home-view';
import Events from '@eventbus/eventbus';
import {
    SEARCH_HOSTELS,
} from '@eventbus/constants';
import type { PageController } from '@interfaces/controllers';

export default class HomeController implements PageController {
    private model: HomeModel;

    private view: HomeView;

    constructor(place: HTMLElement) {
        this.model = new HomeModel();
        this.view = new HomeView(place);
    }

    private searchHostels = (arg: string): void => {
        this.model.search(arg);
    };

    subscribeEvents(): void {
        Events.subscribe(SEARCH_HOSTELS, this.searchHostels);
    }

    unsubscribeEvents(): void {
        Events.unsubscribe(SEARCH_HOSTELS, this.searchHostels);
    }

    activate(params?: URLSearchParams): void {
        this.subscribeEvents();
        this.view.render();
        if (params) {
            this.updateParams(params);
        }
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }

    updateParams(params: URLSearchParams): void {
        const pattern = params.get('pattern');
        if (pattern === null) {
            this.view.listComponentOff();
        } else {
            this.model.search(pattern);
            this.view.listComponentOn(pattern);
        }
    }
}

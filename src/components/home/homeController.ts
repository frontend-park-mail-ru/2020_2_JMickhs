import HomeModel from '@home/homeModel';
import HomeView from '@home/homeView';
import Events from '@eventBus/eventbus';
import {
    SEARCH_HOSTELS,
} from '@eventBus/constants';
import { PageController } from '@interfaces/controllers';
import { HandlerEvent } from '@interfaces/functions';

export default class HomeController implements PageController {
    private model: HomeModel;

    private view: HomeView;

    private handlers: Record<string, HandlerEvent>;

    constructor(parent: HTMLElement) {
        this.model = new HomeModel();
        this.view = new HomeView(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        const handlers = {
            searchHostels: (arg: string): void => {
                this.model.search(arg);
            },
        };
        return handlers;
    }

    subscribeEvents(): void {
        Events.subscribe(SEARCH_HOSTELS, this.handlers.searchHostels);
    }

    unsubscribeEvents(): void {
        Events.unsubscribe(SEARCH_HOSTELS, this.handlers.searchHostels);
    }

    activate(): void {
        this.subscribeEvents();
        this.view.render();
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }

    updateParams(params: URLSearchParams): void {
        const pattern = params.get('pattern');
        if (pattern === null) {
            this.view.containerToSearch();
        } else {
            this.model.search(pattern);
            this.view.containerToList();
        }
    }
}

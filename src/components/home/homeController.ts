import HomeModel from '@home/homeModel';
import HomeView from '@home/homeView';
import ListController from '@list/listController';
import Events from '@eventBus/eventbus';
import {
    SET_CONTAINER_FOR_LIST,
    SET_CONTAINER_FOR_SEARCH,
    SEARCH_HOSTELS,
} from '@eventBus/constants';
import { PageController } from '@interfaces/controllers';
import Redirector from '@router/redirector';
import { HandlerEvent } from '@interfaces/functions';

export default class HomeController implements PageController {
    private model: HomeModel;

    private view: HomeView;

    private listComponent: ListController;

    private handlers: Record<string, HandlerEvent>;

    constructor(parent: HTMLElement) {
        this.model = new HomeModel();
        this.view = new HomeView(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        const handlers = {
            searchHostels: (arg: string) => {
                Redirector.redirectTo(`?pattern=${arg}&page=0`);
                this.listComponent.activate(this.model.search(arg));
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
        this.listComponent = new ListController(this.view.listElem());
    }

    deactivate(): void {
        this.listComponent.deactivate();
        this.view.hide();
        this.unsubscribeEvents();
    }

    updateParams(params: URLSearchParams): void {
        const pattern = params.get('pattern');
        if (pattern === null) {
            this.listComponent.deactivate();
            Events.trigger(SET_CONTAINER_FOR_SEARCH);
        } else {
            Events.trigger(SET_CONTAINER_FOR_LIST);
            this.listComponent.activate(this.model.search(pattern));
        }
    }
}

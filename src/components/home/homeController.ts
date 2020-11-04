import HomeModel from '@/components/home/homeModel';
import HomeView from '@/components/home/homeView';
import ListController from '@list/listController';
import Events from '@eventBus/eventbus';
import {
    CHANGE_CNT_TO_LIST,
    CHANGE_CNT_TO_SEARCH,
    SEARCH_HOSTELS,
} from '@eventBus/constants';
import { PageController } from '@interfaces/controllers';
import Redirector from '@/helpers/router/redirector';

export default class HomeController implements PageController {
    private model: HomeModel;

    private view: HomeView;

    private listComponent: ListController;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor(parent: HTMLElement) {
        this.model = new HomeModel();
        this.view = new HomeView(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, (arg: unknown) => void> {
        const handlers = {
            searchHostels: (arg: string) => {
                Redirector.redirectTo(`?pattern=${arg}&page=${0}`);
                this.listComponent.activate(HomeModel.search(arg));
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
        this.view.subscribeEvents();
        this.view.render({});
        this.listComponent = new ListController(HomeView.listElem());
    }

    deactivate(): void {
        this.listComponent.deactivate();
        this.view.unsubscribeEvents();
        this.view.hide();
        this.unsubscribeEvents();
    }

    updateParams(params: URLSearchParams): void {
        const pattern = params.get('pattern');
        if (pattern === null) {
            this.listComponent.deactivate();
            Events.trigger(CHANGE_CNT_TO_SEARCH);
        } else {
            Events.trigger(CHANGE_CNT_TO_LIST);
            this.listComponent.activate(HomeModel.search(pattern));
        }
    }
}

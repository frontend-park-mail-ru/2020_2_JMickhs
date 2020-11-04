import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    SET_CONTAINER_FOR_LIST,
    SET_CONTAINER_FOR_SEARCH,
    SEARCH_HOSTELS,
} from '@eventBus/constants';
import { Handler } from '@interfaces/functions';

export default class HomeView extends PageView {
    private handlers: Record<string, Handler>;

    private mainContainerElement: HTMLDivElement;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, Handler> {
        const handlers = {
            cntToList: () => {
                this.mainContainerElement.className = 'home__container-list-all';
            },
            cntToSearch: () => {
                this.mainContainerElement.className = 'home__container-all';
            },
            searchClick: () => {
                const input = document.getElementById('input') as HTMLInputElement;
                Events.trigger(SEARCH_HOSTELS, input.value);
            },
        };
        return handlers;
    }

    static listElem(): HTMLElement {
        return document.getElementById('list');
    }

    render(): void {
        this.page.innerHTML = homeTemplate();

        const searchBtn = document.getElementById('btn');
        searchBtn.addEventListener('click', this.handlers.searchClick);

        this.subscribeEvents();

        this.mainContainerElement = document.getElementById('cnt') as HTMLDivElement;
    }

    hide(): void {
        const searchBtn = document.getElementById('btn');
        searchBtn.removeEventListener('click', this.handlers.searchClick);

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(SET_CONTAINER_FOR_SEARCH, this.handlers.cntToSearch);
        Events.subscribe(SET_CONTAINER_FOR_LIST, this.handlers.cntToList);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SET_CONTAINER_FOR_SEARCH, this.handlers.cntToSearch);
        Events.unsubscribe(SET_CONTAINER_FOR_LIST, this.handlers.cntToList);
    }
}

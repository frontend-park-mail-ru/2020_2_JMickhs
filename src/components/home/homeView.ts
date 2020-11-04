import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    CHANGE_CNT_TO_LIST,
    CHANGE_CNT_TO_SEARCH,
    SEARCH_HOSTELS,
} from '@eventBus/constants';
import { Handler } from '@interfaces/functions';

export default class HomeView extends PageView {
    private handlers: Record<string, Handler>;

    private cntElement: HTMLDivElement;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, Handler> {
        const handlers = {
            cntToList: () => {
                this.cntElement.className = 'home__container-list-all';
            },
            cntToSearch: () => {
                this.cntElement.className = 'home__container-all';
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

        this.cntElement = document.getElementById('cnt') as HTMLDivElement;
    }

    hide(): void {
        const searchBtn = document.getElementById('btn');
        searchBtn.removeEventListener('click', this.handlers.searchClick);

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(CHANGE_CNT_TO_SEARCH, this.handlers.cntToSearch);
        Events.subscribe(CHANGE_CNT_TO_LIST, this.handlers.cntToList);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(CHANGE_CNT_TO_SEARCH, this.handlers.cntToSearch);
        Events.unsubscribe(CHANGE_CNT_TO_LIST, this.handlers.cntToList);
    }
}

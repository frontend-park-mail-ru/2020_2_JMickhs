import {PageView} from '@interfaces/views';
import Events from '@eventBus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    CHANGE_CNT_TO_LIST,
    CHANGE_CNT_TO_SEARCH,
    SEARCH_HOSTELS,
} from '@eventBus/constants';

export default class HomeView extends PageView {
    private handlers: Record<string, (arg: unknown) => void>;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, (arg: unknown) => void> {
        const handlers = {
            cntToList: () => {
                const cnt = document.getElementById('cnt') as HTMLDivElement;
                cnt.className = 'home__container-list-all';
            },
            cntToSearch: () => {
                const cnt = document.getElementById('cnt') as HTMLDivElement;
                cnt.className = 'home__container-all';
            },
            searchClick: () => {
                const input = document.getElementById('input') as HTMLInputElement;
                Events.trigger(SEARCH_HOSTELS, input.value);
            }
        };
        return handlers;
    }

    get listElem(): HTMLElement {
        return document.getElementById('list');
    }

    render(data: unknown): void {
        this.page.innerHTML = homeTemplate(data);

        const searchBtn = document.getElementById('btn');
        searchBtn.addEventListener('click', this.handlers.searchClick);
    }

    hide(): void {
        const searchBtn = document.getElementById('btn');
        searchBtn.removeEventListener('click', this.handlers.searchClick);

        this.page.innerHTML = '';
    }

    subscribeEvents(): void {
        Events.subscribe(CHANGE_CNT_TO_SEARCH, this.handlers.cntToSearch);
        Events.subscribe(CHANGE_CNT_TO_LIST, this.handlers.cntToList);
    }

    unsubscribeEvents(): void {
        Events.unsubscribe(CHANGE_CNT_TO_SEARCH, this.handlers.cntToSearch);
        Events.unsubscribe(CHANGE_CNT_TO_LIST, this.handlers.cntToList);
    }
}

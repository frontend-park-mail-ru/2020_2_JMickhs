import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    SET_CONTAINER_FOR_LIST,
    SET_CONTAINER_FOR_SEARCH,
    SEARCH_HOSTELS,
} from '@eventBus/constants';
import { HandlerEvent } from '@interfaces/functions';

export default class HomeView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private mainContainerElement: HTMLDivElement;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        const handlers = {
            containerToList: (): void => {
                this.mainContainerElement.className = 'home__container-list-all';
            },
            containerToSearch: (): void => {
                this.mainContainerElement.className = 'home__container-all';
            },
            searchClick: (): void => {
                const input = document.getElementById('input') as HTMLInputElement;
                Events.trigger(SEARCH_HOSTELS, input.value);
            },
        };
        return handlers;
    }

    listElem(): HTMLElement {
        return document.getElementById('list');
    }

    render(): void {
        this.page.innerHTML = homeTemplate();

        const searchbutton = document.getElementById('button');
        searchbutton.addEventListener('click', this.handlers.searchClick);

        this.subscribeEvents();

        this.mainContainerElement = document.getElementById('container') as HTMLDivElement;
    }

    hide(): void {
        const searchbutton = document.getElementById('button');
        searchbutton.removeEventListener('click', this.handlers.searchClick);

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(SET_CONTAINER_FOR_SEARCH, this.handlers.containerToSearch);
        Events.subscribe(SET_CONTAINER_FOR_LIST, this.handlers.containerToList);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SET_CONTAINER_FOR_SEARCH, this.handlers.containerToSearch);
        Events.unsubscribe(SET_CONTAINER_FOR_LIST, this.handlers.containerToList);
    }
}

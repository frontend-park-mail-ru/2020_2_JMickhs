import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    SET_CONTAINER_FOR_LIST,
    SET_CONTAINER_FOR_SEARCH,
    FILL_HOSTELS,
} from '@eventBus/constants';
import { HandlerEvent } from '@interfaces/functions';

import '@home/templates/home.css';
import ListComponent from '@home/list-hostels/listComponent';
import { HostelData } from '@interfaces/structsData/hostelData';
import Redirector from '@router/redirector';

export default class HomeView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private mainContainerElement: HTMLDivElement;

    private listComponent: ListComponent;

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
                this.listComponent.deactivate();
            },
            searchClick: (evt: Event): void => {
                evt.preventDefault();
                const input = document.getElementById('input') as HTMLInputElement;
                Redirector.redirectTo(`?pattern=${input.value}&page=0`);
            },
            renderHostelList: (hostels: HostelData[]): void => {
                this.mainContainerElement.className = 'home__container-list-all';
                this.listComponent.activate(hostels);
            },
        };
        return handlers;
    }

    render(): void {
        this.page.innerHTML = homeTemplate();

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', this.handlers.searchClick);

        this.subscribeEvents();

        this.mainContainerElement = document.getElementById('container') as HTMLDivElement;
        this.listComponent = new ListComponent(document.getElementById('list'));
    }

    hide(): void {
        this.listComponent.deactivate();
        const searchButton = document.getElementById('button');
        searchButton.removeEventListener('click', this.handlers.searchClick);

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(SET_CONTAINER_FOR_SEARCH, this.handlers.containerToSearch);
        Events.subscribe(SET_CONTAINER_FOR_LIST, this.handlers.containerToList);
        Events.subscribe(FILL_HOSTELS, this.handlers.renderHostelList);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SET_CONTAINER_FOR_SEARCH, this.handlers.containerToSearch);
        Events.unsubscribe(SET_CONTAINER_FOR_LIST, this.handlers.containerToList);
        Events.unsubscribe(FILL_HOSTELS, this.handlers.renderHostelList);
    }
}

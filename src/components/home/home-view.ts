import { PageView } from '@interfaces/views';
import Events from '@evenbus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    FILL_HOSTELS,
} from '@evenbus/constants';
import { HandlerEvent } from '@interfaces/functions';

import '@home/templates/home.css';
import ListComponent from '@/components/home/list-hostels/list-hostels';
import { HostelData } from '@/helpers/interfaces/structsData/hostel-data';
import Redirector from '@router/redirector';

export default class HomeView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private mainContainerElement: HTMLDivElement;

    private listComponent: ListComponent;

    constructor(parent: HTMLElement) {
        super(parent);
        this.listComponent = new ListComponent();

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        const handlers = {
            searchClick: (evt: Event): void => {
                evt.preventDefault();
                const input = document.getElementById('input') as HTMLInputElement;
                Redirector.redirectTo(`?pattern=${input.value}`);
            },
            renderHostelList: (hostels: HostelData[]): void => {
                this.mainContainerElement.className = 'home__container-list-all';
                this.listComponent.activate(hostels);
            },
        };
        return handlers;
    }

    listComponentOn(): void {
        this.mainContainerElement.className = 'home__container-all';
        this.listComponent.deactivate();
    }

    listComponentOff(pattern: string): void {
        const input = document.getElementById('input') as HTMLInputElement;
        input.value = pattern;
        this.mainContainerElement.className = 'home__container-list-all';
    }

    render(): void {
        this.page.innerHTML = homeTemplate();

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', this.handlers.searchClick);

        this.subscribeEvents();
        this.listComponent.setPlace(document.getElementById('list'));
        this.mainContainerElement = document.getElementById('container') as HTMLDivElement;
    }

    hide(): void {
        this.listComponent.deactivate();
        const searchButton = document.getElementById('button');
        searchButton.removeEventListener('submit', this.handlers.searchClick);

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(FILL_HOSTELS, this.handlers.renderHostelList);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(FILL_HOSTELS, this.handlers.renderHostelList);
    }
}

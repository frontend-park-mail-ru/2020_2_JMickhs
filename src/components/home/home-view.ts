import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    FILL_HOSTELS,
} from '@eventbus/constants';
import type { HandlerEvent } from '@interfaces/functions';

import '@home/templates/home.css';
import ListComponent from '@/components/home/list-hostels/list-hostels';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import Redirector from '@router/redirector';

export default class HomeView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private mainContainerElement: HTMLDivElement;

    private inputElement: HTMLInputElement;

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
                if (this.inputElement.value.length > 50) {
                    this.renderError('Длинна запроса не должна превышать 50 символов');
                    return;
                }
                Redirector.redirectTo(`?pattern=${this.inputElement.value}`);
            },
            renderHostelList: (hostels: HostelData[]): void => {
                this.mainContainerElement.className = 'home__container-list-all';
                this.listComponent.activate(hostels);
            },
        };
        return handlers;
    }

    listComponentOff(): void {
        this.mainContainerElement.className = 'home__container-all';
        this.listComponent.deactivate();
    }

    listComponentOn(pattern: string): void {
        this.inputElement.value = pattern;
        this.mainContainerElement.className = 'home__container-list-all';
    }

    render(): void {
        this.page.innerHTML = homeTemplate();

        const searchForm = document.getElementById('search-form');
        searchForm.addEventListener('submit', this.handlers.searchClick);

        this.subscribeEvents();
        this.listComponent.setPlace(document.getElementById('list') as HTMLDivElement);
        this.mainContainerElement = document.getElementById('container') as HTMLDivElement;
        this.inputElement = document.getElementById('input') as HTMLInputElement;
    }

    renderError(error: string): void {
        this.listComponent.deactivate();
        this.mainContainerElement.className = 'home__container-list-all';
        const list = document.getElementById('list');
        const container = document.createElement('div');
        const errorTag = document.createElement('h4');
        container.appendChild(errorTag);
        container.className = 'home__error';
        errorTag.className = 'home__error--blue';
        errorTag.innerText = error;
        list.appendChild(container);
        this.inputElement.value = '';
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }
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

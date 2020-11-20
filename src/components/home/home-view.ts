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

    private searchForm: HTMLFormElement;

    private searchButton: HTMLButtonElement;

    private inputElement: HTMLInputElement;

    private listComponent: ListComponent;

    private inputTimer: number;

    constructor(parent: HTMLElement) {
        super(parent);
        this.listComponent = new ListComponent();
        this.inputTimer = -1;

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        const handlers = {
            searchClick: (evt: Event): void => {
                evt.preventDefault();

                if (this.searchButton) {
                    this.searchButton.disabled = true;
                }
                Redirector.redirectTo(`?pattern=${this.inputElement.value}`);
            },
            renderHostelList: (hostels: HostelData[]): void => {
                if (this.searchButton) {
                    this.searchButton.disabled = false;
                }
                this.mainContainerElement.className = 'home__container-list-all';
                this.listComponent.activate(hostels);
            },
            changeInput: (): void => {
                if (this.inputElement.value.length > 50) {
                    this.renderError('Длинна запроса не должна превышать 50 символов');
                }
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

    render(err = ''): void {
        this.page.innerHTML = homeTemplate({ error: err });

        this.searchForm = document.getElementById('search-form') as HTMLFormElement;
        this.searchButton = document.getElementById('search-button') as HTMLButtonElement;
        this.inputElement = document.getElementById('input') as HTMLInputElement;
        this.mainContainerElement = document.getElementById('container') as HTMLDivElement;

        this.subscribeEvents();

        this.listComponent.setPlace(document.getElementById('list') as HTMLDivElement);
    }

    renderError(error: string): void {
        this.listComponent.deactivate();
        this.render(error);
        this.clearInputError();
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }
        this.listComponent.deactivate();

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        this.searchForm.addEventListener('submit', this.handlers.searchClick);
        this.inputElement.addEventListener('change', this.handlers.changeInput);
        this.inputElement.addEventListener('keypress', this.handlers.changeInput);
        Events.subscribe(FILL_HOSTELS, this.handlers.renderHostelList);
    }

    private unsubscribeEvents(): void {
        this.searchForm.removeEventListener('submit', this.handlers.searchClick);
        this.inputElement.removeEventListener('change', this.handlers.changeInput);
        this.inputElement.removeEventListener('keypress', this.handlers.changeInput);
        Events.unsubscribe(FILL_HOSTELS, this.handlers.renderHostelList);
    }

    private clearInputError(): void {
        if (this.inputTimer !== -1) {
            window.clearTimeout(this.inputTimer);
        }
        const listElement = document.getElementById('list') as HTMLDivElement;
        this.inputTimer = window.setTimeout(() => {
            if (listElement) {
                listElement.innerHTML = '';
                listElement.classList.remove('home__list--grid-area-search');
            }
            this.inputTimer = -1;
        }, 5000);
    }
}

import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';
import {
    FILL_COORDINATE,
    FILL_HOSTELS,
    FILL_RECOMMENDATION,
} from '@eventbus/constants';

import '@home/templates/home.css';
import ListComponent from '@/components/home/list-hostels/list-hostels';
import FilterComponent from '@/components/home/filtration/filtration';
import type {
    Coordinate,
    HostelData,
} from '@/helpers/interfaces/structs-data/hostel-data';
import Redirector from '@router/redirector';
import mapComponent from '@hostel/map/map';
import Popup from '@popup/popup';

const SEARCH_INPUT_MAX_LENGTH = 50;
const MAP_ZOOM = 13;

export default class HomeView extends PageView {
    private mainContainerElement: HTMLDivElement;

    private searchForm: HTMLFormElement;

    private searchButton: HTMLButtonElement;

    private inputElement: HTMLInputElement;

    private imageElement: HTMLDivElement;

    private recommendationLabelElement: HTMLHeadElement;

    private listComponent: ListComponent;

    private filterComponent: FilterComponent;

    private mapComponent: typeof mapComponent;

    private imageMapElement: HTMLDivElement;

    private inputTimer: number;

    private point: Coordinate;

    constructor(place: HTMLElement) {
        super(place);
        this.mapComponent = mapComponent;
        this.listComponent = new ListComponent();
        this.filterComponent = new FilterComponent();
        this.inputTimer = -1;
    }

    private searchClick = (evt: Event): void => {
        evt.preventDefault();

        if (this.searchButton) {
            this.searchButton.disabled = true;
        }
        this.closeFilter();
        Redirector.redirectTo(this.setSearchUrl());
    };

    private clickMapButton = (evt: Event): void => {
        evt.preventDefault();
        Popup.activate(this.mapComponent, this.point, MAP_ZOOM, (): void => {
            Popup.deactivate();
        });
    };

    private renderHostelList = (hostels: HostelData[]): void => {
        if (this.searchButton) {
            this.searchButton.disabled = false;
        }
        this.mainContainerElement.className = 'home__container-list-all';
        this.listComponent.activate(hostels);
    };

    private renderRecommendationList = (hostels: HostelData[]): void => {
        this.listComponent.activate(hostels);
    };

    private changeInput = (): void => {
        if (this.inputElement.value.length > SEARCH_INPUT_MAX_LENGTH) {
            this.renderError(`Длинна запроса не должна превышать ${SEARCH_INPUT_MAX_LENGTH} символов`);
        }
    };

    private getCoordinate = (point: Coordinate): void => {
        this.point = point;
        if (!point || !point.latitude || !point.longitude) {
            this.imageMapElement.classList.add('home__display-none');
        } else {
            this.imageMapElement.classList.remove('home__display-none');
        }
    };

    listComponentOff(): void {
        this.mainContainerElement.className = 'home__container-all';
        this.recommendationLabelElement.classList.remove('home__display-none');
        this.searchForm.classList.add('home__search--start-page-indents');
        this.listComponent.deactivate();
    }

    listComponentOn(pattern: string): void {
        this.listComponent.hide();
        this.inputElement.value = pattern;
        this.recommendationLabelElement.classList.add('home__display-none');
        this.searchForm.classList.remove('home__search--start-page-indents');
        this.mainContainerElement.className = 'home__container-list-all';
    }

    render(err = ''): void {
        this.page.innerHTML = homeTemplate({ error: err });

        this.searchForm = document.getElementById('search-form') as HTMLFormElement;
        this.searchButton = document.getElementById('search-button') as HTMLButtonElement;
        this.inputElement = document.getElementById('input') as HTMLInputElement;
        this.imageElement = document.getElementById('filter-image') as HTMLDivElement;
        this.recommendationLabelElement = document.getElementById('recommendation-label') as HTMLHeadElement;
        this.mainContainerElement = document.getElementById('container') as HTMLDivElement;
        this.imageMapElement = document.getElementById('map-image') as HTMLDivElement;

        this.subscribeEvents();

        this.listComponent.setPlace(document.getElementById('list') as HTMLDivElement);
        this.filterComponent.setPlace(document.getElementById('filter') as HTMLDivElement);
        this.filterComponent.activate();
    }

    renderError(error: string): void {
        this.listComponent.deactivate();
        this.filterComponent.deactivate();
        this.render(error);
        this.clearInputError();
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }
        this.listComponent.deactivate();
        this.filterComponent.deactivate();

        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        this.searchForm.addEventListener('submit', this.searchClick);
        this.inputElement.addEventListener('input', this.changeInput);
        this.imageElement.addEventListener('click', this.toggleFilter);
        this.imageMapElement.addEventListener('click', this.clickMapButton);
        Events.subscribe(FILL_HOSTELS, this.renderHostelList);
        Events.subscribe(FILL_RECOMMENDATION, this.renderRecommendationList);
        Events.subscribe(FILL_COORDINATE, this.getCoordinate);
    }

    private unsubscribeEvents(): void {
        this.searchForm.removeEventListener('submit', this.searchClick);
        this.inputElement.removeEventListener('input', this.changeInput);
        this.imageElement.removeEventListener('click', this.toggleFilter);
        this.imageMapElement.removeEventListener('click', this.clickMapButton);
        Events.unsubscribe(FILL_HOSTELS, this.renderHostelList);
        Events.unsubscribe(FILL_RECOMMENDATION, this.renderRecommendationList);
        Events.unsubscribe(FILL_COORDINATE, this.getCoordinate);
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

    private toggleFilter = (): void => {
        document.getElementById('filter').classList.toggle('home__display-none');
    };

    private closeFilter = (): void => {
        document.getElementById('filter').classList.add('home__display-none');
    };

    private setSearchUrl(): string {
        const {
            rateFrom,
            rateTo,
            percent,
            comments,
        } = this.filterComponent.filterParameters;
        return `?pattern=${this.inputElement.value}&page=0&rateStart=${rateFrom}`
        + `&rateEnd=${rateTo}&commentStart=${comments}&commCount=4,5&commPercent=${percent}`;
    }
}

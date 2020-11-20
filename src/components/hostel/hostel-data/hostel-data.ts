import './hostel-data.css';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import Events from '@eventbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
} from '@eventbus/constants';
import type { AbstractComponent } from '@interfaces/components';
import type { HandlerEvent } from '@interfaces/functions';
import * as dataTemplate from '@hostel/hostel-data/hostel-data.hbs';
import Popup from '../../popup/popup';
import MapComponent from '../map/map';

export default class HostelDataComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private mapComponent: MapComponent;

    private buttonMap: HTMLButtonElement;

    private hostel: HostelData;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.mapComponent = new MapComponent();
        this.handlers = this.makeHandlers();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(hostel: HostelData): void {
        if (!this.place) {
            return;
        }

        this.hostel = hostel;
        this.render(this.hostel);
    }

    private render(hostel: HostelData): void {
        this.place.innerHTML = dataTemplate(hostel);

        this.buttonMap = document.getElementById('map-button') as HTMLButtonElement;

        this.subscribeEvents();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);
        this.buttonMap.addEventListener('click', this.handlers.clickMapButton);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);
        this.buttonMap.removeEventListener('click', this.handlers.clickMapButton);
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            updateTextData: (arg: {rating: number, delta: number}): void => {
                this.hostel.countComments += arg.delta;
                this.hostel.rating = arg.rating;

                this.place.innerHTML = dataTemplate(this.hostel);
            },
            clickMapButton: (evt: Event): void => {
                evt.preventDefault();
                Popup.activate(this.mapComponent, this.hostel.latitude, this.hostel.longitude);
            },
        };
    }
}

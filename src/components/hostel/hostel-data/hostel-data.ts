import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';

import * as dataTemplate from '@hostel/hostel-data/hostel-data.hbs';

import Events from '@eventbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
} from '@eventbus/constants';
import type { AbstractComponent } from '@interfaces/components';
import type { HandlerEvent } from '@interfaces/functions';

export default class HostelDataComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private hostel: HostelData;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
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
        this.subscribeEvents();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            updateTextData: (arg: {rating: number, delta: number}): void => {
                this.hostel.countComments += arg.delta;
                this.hostel.rating = arg.rating;

                this.place.innerHTML = dataTemplate(this.hostel);
            },
        };
    }
}

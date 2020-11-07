import { AbstractController } from '@interfaces/controllers';
import Events from '@eventBus/eventbus';
import { LOAD_HOSTELS } from '@eventBus/constants';
import { HandlerEvent } from '@interfaces/functions';
import * as listTemplate from '@home/list-hostels/listTemplate.hbs';
import { HostelData } from '@interfaces/structsData/hostelData';
import '@home/list-hostels/hotels.css';

export default class ListComponent implements AbstractController {
    public haveInfo: boolean;

    private handlers: Record<string, HandlerEvent>;

    private hostels: HostelData[];

    private page: HTMLElement;

    constructor(place: HTMLElement) {
        this.page = place;
        this.haveInfo = false;
        this.hostels = [];

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        const handlers = {
            renderHoslels: (): void => {
                this.render(this.hotels);
            },
        };
        return handlers;
    }

    private subscribeEvents(): void {
        Events.subscribe(LOAD_HOSTELS, this.handlers.renderHoslels);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(LOAD_HOSTELS, this.handlers.renderHoslels);
    }

    activate(hostels: HostelData[]): void {
        this.subscribeEvents();
        if (!this.haveInfo) {
            this.hotels = hostels;
        }

        this.render(this.hotels);
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.hide();
        this.haveInfo = false;
    }

    set hotels(hotels: HostelData[]) {
        this.hostels = hotels;
        this.locationSlicer();
    }

    get hotels(): HostelData[] {
        return this.hostels;
    }

    locationSlicer(): void {
        this.hostels.forEach((curr, index) => {
            if (curr.location) {
                const tmp = curr.location.split(', ');
                this.hostels[index].location = `${tmp[tmp.length - 1]}, ${tmp[tmp.length - 2]}`;
            }
        });
    }

    render(data: HostelData[]): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = listTemplate(data);
    }

    hide(): void {
        this.page.innerHTML = '';
    }
}

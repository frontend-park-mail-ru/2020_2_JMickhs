import type { AbstractController } from '@interfaces/controllers';
import * as listTemplate from '@home/list-hostels/list-hostels.hbs';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import '@home/list-hostels/list-hostels.css';

export default class ListComponent implements AbstractController {
    public haveInfo: boolean;

    private hostels: HostelData[];

    private place: HTMLElement;

    constructor() {
        this.haveInfo = false;
        this.hostels = [];
    }

    activate(hostels: HostelData[]): void {
        if (!this.place) {
            return;
        }
        this.hotels = hostels;
        if (hostels.length > 0) {
            this.haveInfo = true;
        }

        this.render({ hotels: this.hotels, haveInfo: this.haveInfo });
    }

    deactivate(): void {
        this.hide();
        this.haveInfo = false;
    }

    setPlace(place: HTMLElement): void {
        this.place = place;
    }

    set hotels(hotels: HostelData[]) {
        this.haveInfo = false;
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

    render(data: { hotels: HostelData[], haveInfo: boolean }): void {
        window.scrollTo(0, 0);
        this.place.innerHTML = listTemplate(data);
    }

    hide(): void {
        this.place.innerHTML = '';
    }
}

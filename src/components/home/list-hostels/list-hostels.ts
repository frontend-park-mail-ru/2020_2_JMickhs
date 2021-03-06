import * as listTemplate from '@home/list-hostels/list-hostels.hbs';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import '@home/list-hostels/list-hostels.css';
import type { AbstractComponent } from '@interfaces/components';

export default class ListComponent implements AbstractComponent {
    public haveInfo: boolean;

    private hostels: HostelData[];

    private place?: HTMLDivElement;

    constructor() {
        this.haveInfo = false;
        this.hostels = [];
    }

    activate(hostels: HostelData[]): void {
        if (!this.place) {
            return;
        }
        this.deactivate();

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

    setPlace(place: HTMLDivElement): void {
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

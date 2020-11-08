import { AbstractController } from '@interfaces/controllers';
import * as listTemplate from '@home/list-hostels/listTemplate.hbs';
import { HostelData } from '@interfaces/structsData/hostelData';
import '@home/list-hostels/hotels.css';

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
        this.hostels = hotels;
        this.haveInfo = false;
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

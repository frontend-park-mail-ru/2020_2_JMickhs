import { AbstractController } from '@interfaces/controllers';
import * as listTemplate from '@home/list-hostels/listTemplate.hbs';
import { HostelData } from '@interfaces/structsData/hostelData';
import '@home/list-hostels/hotels.css';

export default class ListComponent implements AbstractController {
    public haveInfo: boolean;

    private hostels: HostelData[];

    private page: HTMLElement;

    constructor(place: HTMLElement) {
        this.page = place;
        this.haveInfo = false;
        this.hostels = [];
    }

    activate(hostels: HostelData[]): void {
        if (!this.haveInfo) {
            this.hotels = hostels;
        }

        this.render(this.hotels);
    }

    deactivate(): void {
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

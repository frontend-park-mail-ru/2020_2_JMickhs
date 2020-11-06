import * as listTemplate from '@list/templates/listTemplate.hbs';
import '@/components/listHostel/templates/hostels.css';
import { HostelData } from '@interfaces/structsData/hostelData';

export default class ListView {
    private page: HTMLElement;

    constructor(place: HTMLElement) {
        this.page = place;
    }

    render(data: HostelData[]): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = listTemplate(data);
    }

    hide(): void {
        this.page.innerHTML = '';
    }
}

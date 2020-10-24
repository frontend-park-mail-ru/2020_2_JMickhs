import {PageView} from '@interfaces/views';
import {hostelCardTemplate} from '@hostel/templates/wrapper';
import {HostelData} from '@interfaces/hostelData';

export default class HostelPageView extends PageView {
    constructor(parent: HTMLElement) {
        super(parent);
    }

    render(data: HostelData): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);
    }
}
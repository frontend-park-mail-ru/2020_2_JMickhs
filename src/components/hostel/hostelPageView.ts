import {PageView} from '@interfaces/views';
import {HostelData} from '@interfaces/hostelData';

import * as hostelCardTemplate from '@hostel/templates/hostelCard.hbs';

export default class HostelPageView extends PageView {
    constructor(parent: HTMLElement) {
        super(parent);
    }

    render(data: HostelData): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelCardTemplate(data);
    }
}
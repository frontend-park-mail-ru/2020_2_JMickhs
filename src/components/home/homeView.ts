import {PageView} from '@interfaces/views';
import * as homeTemplate from '@home/templates/homeTemplate.hbs';

export default class HomeView extends PageView {

    constructor(parent: HTMLElement) {
        super(parent);
    }

    render(data: unknown): void {
        this.page.innerHTML = homeTemplate(data);
    }

    hide(): void {
        this.page.innerHTML = '';
    }
}

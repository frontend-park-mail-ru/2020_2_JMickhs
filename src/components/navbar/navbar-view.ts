import * as navbarTemplate from '@navbar/templates/navbar.hbs';
import '@navbar/templates/navbar.css';

export default class NavView {
    private place: HTMLElement;

    constructor(place: HTMLElement) {
        this.place = place;
    }

    render(data: { isAuth: boolean, renderProfileButtons: boolean, username: string }): void {
        this.place.innerHTML = navbarTemplate(data);
    }
}

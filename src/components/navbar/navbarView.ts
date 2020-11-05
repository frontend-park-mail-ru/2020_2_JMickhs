import * as navbarTemplate from '@navbar/templates/navbar.hbs';

export default class NavView {
    private place: HTMLDivElement;

    constructor(parent: HTMLElement) {
        let place = document.getElementById('navbar') as HTMLDivElement;
        if (place == null) {
            place = document.createElement('div');
            place.id = 'navbar';
            parent.appendChild(place);
        }
        this.place = place;
    }

    render(data: {isAuth: boolean, username: string}): void {
        this.place.innerHTML = navbarTemplate(data);
    }
}

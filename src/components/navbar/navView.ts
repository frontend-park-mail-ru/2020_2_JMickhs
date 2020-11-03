import * as navbarTemplate from '@navbar/templates/navbar.hbs';

export default class NavView {
    private navbar: HTMLElement;

    constructor(parent: HTMLElement) {
        let nav = document.getElementById('navbar');
        if (nav == null) {
            nav = document.createElement('div');
            nav.id = 'navbar';
            parent.appendChild(nav);
        }
        this.navbar = nav;
    }

    render(data: {isAuth: boolean, username: string}): void {
        this.navbar.innerHTML = navbarTemplate(data);
    }
}

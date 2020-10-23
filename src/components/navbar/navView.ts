import navTemplate from '@navbar/templates/wrapper';

interface NavElem {
    text: string,
    href: string,
    active: boolean;
}

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
    
    render(data: {elems: NavElem[], active: number}): void {
        this.navbar.innerHTML = navTemplate(data.elems);
    }
}
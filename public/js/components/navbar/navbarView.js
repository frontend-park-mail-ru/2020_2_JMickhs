import Router from '../../helpers/router/router';
import NavbarModel from './navbarModel';

export default class NavbarView {
    constructor(parent, model) {
        if (parent instanceof HTMLElement && model instanceof NavbarModel) {
            this._parent = parent;
            this._model = model;
        }

        EventBus.subscribe('updateNavbar', this.render.bind(this));

        let nav = document.getElementById('navbar');
        if (nav == null) {
            nav = document.createElement('div');
            nav.id = 'navbar';
            this._parent.appendChild(nav);
        }
        this.navbar = nav;
    }
    render() {
        this.navbar.innerHTML = `
        <ul class="menu-main">
        <li>
            <a href="" id="nav1">${this._model.el1.text}</a>
        </li>
        <li>
            <a href="" id="nav2">${this._model.el2.text}</a>
        </li>
        <li>
            <a href="" id="nav3">${this._model.el3.text}</a>    
        </li>
        </ul>
        `;
        let nav1 = document.getElementById('nav1');
        nav1.addEventListener('click', (evt) => {
            evt.preventDefault();
            router.pushState(this._model.el1.ref);
        });
        let nav2 = document.getElementById('nav2');
        nav2.addEventListener('click', (evt) => {
            evt.preventDefault();
            router.pushState(this._model.el2.ref);
        });
        nav3.addEventListener('click', (evt) => {
            evt.preventDefault();
            router.pushState(this._model.el3.ref);
        });
    }
}
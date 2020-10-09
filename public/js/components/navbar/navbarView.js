import NavbarModel from './navbarModel';
import Events from './../../helpers/eventbus/eventbus';

/** Класс представления для навбара */
export default class NavbarView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        if (parent instanceof HTMLElement && model instanceof NavbarModel) {
            this._parent = parent;
            this._model = model;
        }

        Events.subscribe('updateNavbar', this.render.bind(this));

        let nav = document.getElementById('navbar');
        if (nav == null) {
            nav = document.createElement('div');
            nav.id = 'navbar';
            this._parent.appendChild(nav);
        }
        this.navbar = nav;
    }
    /**
     * Отрисовка навбара
     */
    render() {
        this.navbar.innerHTML = `
        <ul class="menu-main">
        <li>
            <a href="${this._model.el1.ref}">${this._model.el1.text}</a>
        </li>
        <li>
            <a href="${this._model.el2.ref}">${this._model.el2.text}</a>
        </li>
        <li>
            <a href="${this._model.el3.ref}">${this._model.el3.text}</a>    
        </li>
        </ul>
        `;
    }
}

import NavbarModel from './navbarModel';
// eslint-disable-next-line no-undef
const navbarTemplate = require('./navbarTemplate.hbs');
import Events from './../../helpers/eventbus/eventbus';
import {UPDATE_NAVBAR} from '../../helpers/eventbus/constants';

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

        Events.subscribe(UPDATE_NAVBAR, this.render.bind(this));

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
        this.navbar.innerHTML = navbarTemplate(this._model);
    }
}

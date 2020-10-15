import NavbarModel from './navbarModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    NAVBAR_ACTIVE,
    UPDATE_NAVBAR,
} from '../../helpers/eventbus/constants';

// eslint-disable-next-line no-undef
const navbarTemplate = require('./navbarTemplate.hbs');

/** Класс представления для навбара */
export default class NavbarView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._handlers = {
            render: this.render.bind(this),
            navbarActive: (arg) => {
                document.getElementById('nav1').className = '';
                document.getElementById('nav2').className = '';
                document.getElementById('nav3').className = '';
                const tmp = document.getElementById(`nav${arg}`);
                if (tmp !== null) {
                    tmp.className = 'current';
                }
            },
        };

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
     * Подписка на события навбара
     */
    subscribeEvents() {
        Events.subscribe(UPDATE_NAVBAR, this._handlers.render);
        Events.subscribe(NAVBAR_ACTIVE, this._handlers.navbarActive);
    }
    /**
     * Отрисовка навбара
     */
    render() {
        this.navbar.innerHTML = navbarTemplate(this._model);
    }
}

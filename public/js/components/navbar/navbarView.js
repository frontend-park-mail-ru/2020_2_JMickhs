import NavbarModel from './navbarModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    FIX_USER,
    NAVBAR_ACTIVE,
    PAGE_SIGNIN,
    PAGE_SIGNUP,
    UPDATE_NAVBAR,
    UPDATE_USER,
} from '../../helpers/eventbus/constants';

import navbarTemplate from './templates/navbarTemplate.hbs';

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

        let nav = document.getElementById('navbar');
        if (nav == null) {
            nav = document.createElement('div');
            nav.id = 'navbar';
            this._parent.appendChild(nav);
        }
        this.navbar = nav;

        this._makeHandlers();
    }
    /**
     * Подписка на события навбара
     */
    subscribeEvents() {
        Events.subscribe(UPDATE_NAVBAR, this._handlers.render);
        Events.subscribe(NAVBAR_ACTIVE, this._handlers.navbarActive);
        Events.subscribe(UPDATE_USER, this._handlers.updateUser);
        Events.subscribe(PAGE_SIGNUP, this._handlers.pageSignup);
        Events.subscribe(PAGE_SIGNIN, this._handlers.pageSignin);
        Events.subscribe(FIX_USER, this._handlers.updateUser);
    }
    /**
     * Функция создает и заполняет поле _handlers обработчиками событий
     */
    _makeHandlers() {
        this._handlers = {
            render: this.render.bind(this),
            navbarActive: (arg) => {
                this._curr = arg;
                document.getElementById('nav1').className = '';
                document.getElementById('nav2').className = '';
                document.getElementById('nav3').className = '';
                const tmp = document.getElementById(`nav${arg}`);
                if (tmp !== null) {
                    tmp.className = 'current';
                }
            },
            updateUser: () => {
                if (this._model._user.isAuth) {
                    this._model.el3 = {text: this._model._user.login, ref: '/profile'};
                    Events.trigger(UPDATE_NAVBAR);
                    this._handlers.navbarActive(this._curr);
                }
            },
            pageSignup: () => {
                this._model.el3 = {text: 'Регистрация', ref: '/signup'};
                Events.trigger(UPDATE_NAVBAR);
            },
            pageSignin: () => {
                this._model.el3 = {text: 'Авторизация', ref: '/signin'};
                Events.trigger(UPDATE_NAVBAR);
            },
        };
    }
    /**
     * Отрисовка навбара
     */
    render() {
        this.navbar.innerHTML = navbarTemplate(this._model);
    }
}

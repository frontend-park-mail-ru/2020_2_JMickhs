import pageTemplate from './templates/page.hbs';
import Events from '../../helpers/eventbus/eventbus';
import {GET_ERROR} from '../../helpers/eventbus/constants';

/** Класс представления для страницы профиля */
export default class ProfileView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        if (parent instanceof HTMLElement) {
            this._parent = parent;
        }

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;

        this._makeHandlers();
    }
    /**
     * Подписка на события страницы профиля
     */
    subscribeEvents() {
        Events.subscribe(GET_ERROR, this._handlers.getErr);
    }
    /**
     * Отписка от событий страницы профиля
     */
    unsubscribeEvents() {
        Events.unsubscribe(GET_ERROR, this._handlers.getErr);
    }
    /**
     * Функция создает и заполняет поле _handlers обработчиками событий
     */
    _makeHandlers() {
        this._handlers = {
            getErr: (arg) => {
                this._error = arg;
            },
        };
    }
    /**
     * Отрисовка страницы профиля
     */
    render() {
        this.page.innerHTML = pageTemplate({error: this._error});
    }
    /**
     * Скрытие страницы профиля
     */
    hide() {
        this.page.innerHTML = '';
    }
}

import Events from './../../helpers/eventbus/eventbus';
import {UPDATE_HOSTEL} from '../../helpers/eventbus/constants';

import hostelTemplate from './templates/hostelTemplate.hbs';

/** Класс представления для страницы отеля */
export default class HostelView {
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
     * Подписка на события страницы отеля
     */
    subscribeEvents() {
        Events.subscribe(UPDATE_HOSTEL, this._handlers.render);
    }
    /**
     * Отписка от событий страницы отеля
     */
    unsubscribeEvents() {
        Events.unsubscribe(UPDATE_HOSTEL, this._handlers.render);
    }
    /**
     * Функция создает и заполняет поле _handlers обработчиками событий
     */
    _makeHandlers() {
        this._handlers = {
            render: this.render.bind(this),
        };
    }
    /**
     * Отрисовка страницы отеля
     * @param {Object} data - модель, по которой все рендериться
     */
    render(data) {
        window.scrollTo(0, 0);
        this.page.innerHTML = hostelTemplate(data);
    }
    /**
     * Скрытие страницы отеля
     */
    hide() {
        this.page.innerHTML = '';
    }
}

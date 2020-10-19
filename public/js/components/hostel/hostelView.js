import Events from './../../helpers/eventbus/eventbus';
import {UPDATE_HOSTEL} from '../../helpers/eventbus/constants';

import hostelTemplate from './hostelTemplate.hbs';

/** Класс представления для страницы отеля */
export default class HostelView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._handlers = {
            render: this.render.bind(this),
        };

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
     * Отрисовка страницы отеля
     * @param {Object} data - модель, по которой все рендериться
     */
    render(data) {
        this.page.innerHTML = hostelTemplate(data);
    }
    /**
     * Скрытие страницы отеля
     */
    hide() {
        this.page.innerHTML = '';
    }
}

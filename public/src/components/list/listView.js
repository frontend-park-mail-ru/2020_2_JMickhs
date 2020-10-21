import Events from './../../helpers/eventbus/eventbus';
import {LOAD_HOSTELS} from '../../helpers/eventbus/constants';

import myTemplate from './templates/listTemplate.hbs';

/** Класс представления для страницы списка отелей */
export default class ListView {
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
        }
        this._parent.appendChild(page);
        this.page = page;
    }
    /**
     * Подписка на события списка отелей
     */
    subscribeEvents() {
        Events.subscribe(LOAD_HOSTELS, this._handlers.render);
    }
    /**
     * Отписка от событий списка отелей
     */
    unsubscribeEvents() {
        Events.unsubscribe(LOAD_HOSTELS, this._handlers.render);
    }
    /**
     * Отрисовка страницы списка отелей
     * @param {Object} data - модель, по которой рендерить
     */
    render(data) {
        this.page.innerHTML = myTemplate(data);
    }
    /**
     * Скрытие страницы списка отелей
     */
    hide() {
        this.page.innerHTML = '';
    }
}

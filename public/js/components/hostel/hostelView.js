import Events from './../../helpers/eventbus/eventbus';
import {UPDATE_HOSTEL} from '../../helpers/eventbus/constants';
// eslint-disable-next-line no-undef
const hostelTemplate = require('./hostelTemplate.hbs');

/** Класс представления для страницы отеля */
export default class HostelView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._model = model;
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
     */
    render() {
        this.page.innerHTML = hostelTemplate(this._model);
    }
    /**
     * Скрытие страницы отеля
     */
    hide() {
        this.page.innerHTML = '';
    }
}

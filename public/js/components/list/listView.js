import ListModel from './listModel';
import Events from './../../helpers/eventbus/eventbus';
import {LOAD_HOSTELS} from '../../helpers/eventbus/constants';

// eslint-disable-next-line no-undef
const myTemplate = require('./listTemplate.hbs');

/** Класс представления для страницы списка отелей */
export default class ListView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._handlers = {
            render: this.render.bind(this),
        };

        if (parent instanceof HTMLElement && model instanceof ListModel) {
            this._parent = parent;
            this._model = model;
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
     */
    render() {
        this.page.innerHTML = myTemplate(this._model.hostels);
    }
    /**
     * Скрытие страницы списка отелей
     */
    hide() {
        this.page.innerHTML = '';
    }
}

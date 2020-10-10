import ListModel from './listModel';
import Events from './../../helpers/eventbus/eventbus';

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
        if (parent instanceof HTMLElement && model instanceof ListModel) {
            this._parent = parent;
            this._model = model;
        }

        let page = document.getElementById('page');

        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
        }
        page.className = 'page-wrap';

        this._parent.appendChild(page);
        this.page = page;

        Events.subscribe('loadHostels', () => {
            this.render();
        });
    }
    /**
     * Отрисовка страницы отеля
     */
    render() {
        this.page.innerHTML = myTemplate(this._model.hostels);
    }
}

import {PageView} from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {LOAD_HOSTELS} from '@eventBus/constants';
import myTemplate from '@list/templates/listTemplate.hbs';

/** Класс представления для страницы списка отелей */
export default class ListView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        super(parent);

        this._handlers = {
            render: this.render.bind(this),
        };
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
        window.scrollTo(0, 0);
        this.page.innerHTML = myTemplate(data);
    }
    /**
     * Скрытие страницы списка отелей
     */
    hide() {
        this.page.innerHTML = '';
    }
}

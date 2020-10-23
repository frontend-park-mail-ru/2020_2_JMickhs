import PageView from '@basic/pageView';
import Events from '@eventBus/eventbus';
import {UPDATE_HOSTEL} from '@eventBus/constants';
import hostelTemplate from '@hostel/templates/hostelTemplate.hbs';

/** Класс представления для страницы отеля */
export default class HostelView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        super(parent);

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

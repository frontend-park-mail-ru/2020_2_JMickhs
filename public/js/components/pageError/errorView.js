import Events from '../../helpers/eventbus/eventbus';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus/constants';

/** Класс представления для страницы ошибки */
export default class ErrorView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        if (parent instanceof HTMLElement) {
            this._parent = parent;
        }
    }
    /**
     * Отрисовка домашней страницы
     * @param {string} err - тип ошибки
     */
    render(err) {
        Events.trigger(NAVBAR_ACTIVE, -1);
        document.getElementById('page').innerHTML = `
            <p class="text-first">Уупс, произошла ошибка!</p>
            <p class="text">${err}</p>
            `;
    }
}

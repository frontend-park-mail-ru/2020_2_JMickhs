import ErrorView from './errorView';
import Events from '../../helpers/eventbus/eventbus';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus/constants';

/** Класс констроллера для страницы ошибки */
export default class ErrorController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        if (parent instanceof HTMLElement) {
            this._view = new ErrorView(parent);
        }
    }
    /**
     * Установка поля ошибки
     * @param {string} err - текст ошибки
     */
    set error(err) {
        this._view._error = err;
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger(NAVBAR_ACTIVE, -1);
        this._view.render();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.hide();
    }
}

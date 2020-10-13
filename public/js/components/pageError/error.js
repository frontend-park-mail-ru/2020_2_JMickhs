import Events from '../../helpers/eventbus/eventbus';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus/constants';

/** Класс-заглушка ошибки */
export default class ErrorPage {
/**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._parent = parent;
    }
    /**
     * Активация работы контроллера
     * @param {string} type - тип ошибки
     */
    activate(type) {
        Events.trigger(NAVBAR_ACTIVE, -1);
        document.getElementById('page').innerHTML = `
            <p class="text-first">Уупс, произошла ошибка!</p>
            <p class="text">Такой страницы не существует</p>
            `;
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        // TODO:
    }
}

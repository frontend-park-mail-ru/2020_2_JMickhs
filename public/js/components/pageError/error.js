import Events from '../../helpers/eventbus/eventbus';

/** Класс заглушка контроллера для навбара */
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
        Events.trigger('navbarActive', -1);
        document.getElementById('page').innerHTML = `
            <p class="text-first">Уупс, произошла ошибка!</p>
            <p class="text">Такой страницы не существует</p>
            `;
    }
}

import NavbarModel from 'navbar/navbarModel';
import NavbarView from 'navbar/navbarView';

/** Класс контроллера для навбара */
export default class NavbarController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new NavbarModel();
        if (parent instanceof HTMLElement) {
            this._view = new NavbarView(parent, this._model);
        }
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.render();
        this._view.subscribeEvents();
    }
}

import HomeView from './homeView';

/** Класс контроллера для домашней страницы */
export default class HomeController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._view = new HomeView(parent);
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.render();
    }
}

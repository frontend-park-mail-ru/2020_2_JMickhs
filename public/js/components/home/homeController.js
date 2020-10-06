import HomeView from './homeView';

/** Класс контроллера для домашней страницы */
export default class HomeController {
    /**
     * Инициализация класса
     * @param {*} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._view = new HomeView(parent);
    }
    /**
     * Отрисовка домашней страницы
     */
    activate() {
        this._view.render();
    }
}
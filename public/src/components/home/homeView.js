import homePageTemplate from './templates/templateHome.hbs';

/** Класс представления для домашней страницы */
export default class HomeView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        if (parent instanceof HTMLElement) {
            this._parent = parent;
        }
        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
    }
    /**
     * Отрисовка домашней страницы
     */
    render() {
        this.page.innerHTML = homePageTemplate();
    }
    /**
     * Скрытие домашней страницы
     */
    hide() {
        this.page.innerHTML = '';
    }
}

import pageTemplate from './templates/page.hbs';

/** Класс представления для страницы профиля */
export default class PageView {
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
     * Подписка на события страницы профиля
     */
    subscribeEvents() {}
    /**
     * Отписка от событий страницы профиля
     */
    unsubscribeEvents() {}
    /**
     * Отрисовка страницы профиля
     */
    render() {
        if (this._error === undefined) {
            this._error = 'Такой страницы не существует';
        }
        this.page.innerHTML = pageTemplate({error: this._error});
    }
    /**
     * Скрытие страницы профиля
     */
    hide() {
        this.page.innerHTML = '';
    }
}

import pageTemplate from './templates/page.hbs';

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

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
        }
        this._parent.appendChild(page);
        this.page = page;
    }
    /**
     * Отрисовка страницы ошибок
     * @param {string} err - тип ошибки
     */
    render(err) {
        this.page.innerHTML = pageTemplate({error: err});
    }
    /**
     * Скрытие страницы ошибок
     */
    hide() {
        this.page.innerHTML = '';
    }
}

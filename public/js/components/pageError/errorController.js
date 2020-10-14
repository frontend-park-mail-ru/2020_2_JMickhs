import ErrorView from './errorView';

/** Класс констроллера для страницы ошибки */
export default class ErrorController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        console.log('Hello from error Controller');
        if (parent instanceof HTMLElement) {
            this._view = new ErrorView(parent);
        }
        this.err = 'Такой страницы не существует';
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.render(this.err);
    }
    /**
     * Установка поля ошибки
     * @param {string} err - текст ошибки
     */
    set error(err) {
        this._error = err;
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this.err = 'Такой страницы не существует';
        // TODO:
    }
}

import SigninModel from '@signin/signinModel';
import SigninView from '@signin/signinView';
import Events from '@eventBus/eventbus';
import {
    REDIRECT,
    PAGE_SIGNIN,
    SUBMIT_SIGNIN,
    HAVE_USER,
} from '@eventBus/constants';

/** Класс контроллера для страницы авторизации */
export default class SigninController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent);

        this._handlers = this._makeHandlers();
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this.subscribeEvents();
        this._view.subscribeEvents();
        Events.trigger(PAGE_SIGNIN);
        if (this._model.isAuth()) {
            this.redirectToProfile();
            return;
        }
        this._view.render();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.unsubscribeEvents();
        this._view.hide();
        this.unsubscribeEvents();
    }
    /**
     * Проверка формы авторизации
     * @param {Object} arg - {login: string, password: string}
     */
    validate(arg) {
        const username = arg.login;
        const psw = arg.password;
        let resolution = true;
        if (username === '') {
            resolution = false;
            this._view.renderError('Заполните все поля!', 1);
        }
        if (psw === '') {
            resolution = false;
            this._view.renderError('Заполните все поля!', 2);
        }

        if (resolution) {
            this._model.signin(username, psw);
        }
    }
    /**
     * Редирект на страницу пользователя
     */
    redirectToProfile() {
        Events.trigger(REDIRECT, {url: '/profile'});
    }
    /**
     * Подписка на необходимые события
     */
    subscribeEvents() {
        Events.subscribe(SUBMIT_SIGNIN, this._handlers.validate);
        Events.subscribe(HAVE_USER, this.redirectToProfile)
    }
    /**
     * Отписка от необходимые события
     */
    unsubscribeEvents() {
        Events.unsubscribe(SUBMIT_SIGNIN, this._handlers.validate);
        Events.unsubscribe(HAVE_USER, this.redirectToProfile)
    }
    /**
     * Функция создает обработчики событий
     * @return {Object} - возвращает обьект с обработчиками
     */
    _makeHandlers() {
        const handlers = {
            validate: this.validate.bind(this),
        };
        return handlers;
    }
}

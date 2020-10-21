import SignupModel from './signupModel';
import SignupView from './signupView';
import Events from '../../helpers/eventbus/eventbus';
import {
    NAVBAR_ACTIVE,
    PAGE_SIGNUP,
    REDIRECT,
    SUBMIT_SIGNUP,
} from '../../helpers/eventbus/constants';
import Validator from '../../helpers/validator/validator';

/** Класс контроллера для страницы регистрации */
export default class SignupController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SignupModel();
        this._view = new SignupView(parent, this._model);
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this.subscribeEvents();
        this._view.subscribeEvents();
        Events.trigger(PAGE_SIGNUP);
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth()) {
            Events.trigger(REDIRECT, {url: '/profile'});
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
    }
    /**
     * Проверка формы авторизации
     * @param {Object} arg
     * login: string,
     * email: string,
     * psw1: string,
     * psw2: string
     */
    validate(arg) {
        const username = arg.login;
        const email = arg.email;
        const psw1 = arg.psw1;
        const psw2 = arg.psw2;

        let resolution = true;

        if (username === '') {
            resolution = false;
            this._view.renderError('Заполните все поля!', 1);
        }
        if (email === '') {
            resolution = false;
            this._view.renderError('Заполните все поля!', 2);
        }
        if (psw1 === '' || psw2 === '') {
            resolution = false;
            this._view.renderError('Заполните все поля!', 3);
        }

        if (psw1 !== psw2) {
            resolution = false;
            this._view.renderError('Пароли не совпадают', 3);
        }

        if (!resolution) {
            return;
        }

        const loginErrors = Validator.validateLogin(username);
        if (loginErrors.length > 0) {
            resolution = false;
            this._view.renderError(loginErrors[0], 1);
        }

        const emailErrors = Validator.validateEmail(email);
        if (emailErrors.length > 0) {
            resolution = false;
            this._view.renderError(emailErrors[0], 2);
        }

        const pswErrors = Validator.validatePassword(psw1);
        if (pswErrors.length > 0) {
            resolution = false;
            this._view.renderError(pswErrors[0], 3);
        }

        if (resolution) {
            this._model.signup(username, email, psw2);
        }
    }
    /**
     * Подписка на необходимые события
     */
    subscribeEvents() {
        Events.subscribe(SUBMIT_SIGNUP, this.validate.bind(this));
    }
    /**
     * Отписка от необходимые события
     */
    unsubscribeEvents() {
        Events.unsubscribe(SUBMIT_SIGNUP, this.validate.bind(this));
    }
}

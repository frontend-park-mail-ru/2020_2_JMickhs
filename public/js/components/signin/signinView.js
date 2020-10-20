import SigninModel from './signinModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    SUBMIT_SIGNIN,
    ERR_LOGIN_SINGIN,
    ERR_PASSWORD_SINGIN,
    ERROR_SIGNIN,
    SIGNIN_USER,
    REDIRECT,
} from '../../helpers/eventbus/constants';
import Validation from '../../helpers/validation/validation';

import signinTemplate from './templates/templateSignin.hbs';

/** Класс представления для страницы авторизации */
export default class SigninView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._handlers = {
            renderErr: (arg) => {
                this.renderError(arg);
            },
            errLoginSignin: (arg) => {
                document.getElementById('signin-login').className = 'input-error';
                this.renderError(arg);
            },
            errPswSigin: (arg) => {
                document.getElementById('signin-password').className = 'input-error';
                this.renderError(arg);
            },
            submitSignin: (arg) => {
                if (arg.login === '' || arg.password === '') {
                    if (arg.login === '') {
                        Events.trigger(ERR_LOGIN_SINGIN, 'Заполните все поля');
                    }
                    if (arg.password === '') {
                        Events.trigger(ERR_PASSWORD_SINGIN, 'Заполните все поля');
                    }
                    return;
                }
                if (
                    Validation.validateLogin(arg.login, ERR_LOGIN_SINGIN) &&
                    Validation.validatePassword(arg.password, ERR_PASSWORD_SINGIN)
                ) {
                    this._model.signin(arg.login, arg.password);
                }
            },
            signinUser: () => {
                if (this._model._user.isAuth) {
                    Events.trigger(REDIRECT, {url: '/profile'});
                } else {
                    Events.trigger(ERROR_SIGNIN, 'Неверный логин или пароль!');
                }
            },
            submitSigninForm: (evt) => {
                evt.preventDefault();
                const loginInput = document.getElementById('signin-login');
                const passInput = document.getElementById('signin-password');
                const login = loginInput.value;
                const password = passInput.value;
                document.getElementById('signin-login').className = 'input-sign';
                document.getElementById('signin-password').className = 'input-sign';
                Events.trigger(SUBMIT_SIGNIN, {login: login, password: password});
            },
        };

        if (parent instanceof HTMLElement && model instanceof SigninModel) {
            this._parent = parent;
            this._model = model;
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
     * Подписка на события страницы авторизации
     */
    subscribeEvents() {
        Events.subscribe(ERROR_SIGNIN, this._handlers.renderErr);
        Events.subscribe(ERR_LOGIN_SINGIN, this._handlers.errLoginSignin);
        Events.subscribe(ERR_PASSWORD_SINGIN, this._handlers.errPswSigin);
        Events.subscribe(SUBMIT_SIGNIN, this._handlers.submitSignin);
        Events.subscribe(SIGNIN_USER, this._handlers.signinUser);
    }
    /**
     * Отписка от событий страницы авторизации
     */
    unsubscribeEvents() {
        Events.unsubscribe(SUBMIT_SIGNIN, this._handlers.submitSignin);
        Events.unsubscribe(ERROR_SIGNIN, this._handlers.renderErr);
        Events.unsubscribe(ERR_LOGIN_SINGIN, this._handlers.errLoginSignin);
        Events.unsubscribe(ERR_PASSWORD_SINGIN, this._handlers.errPswSigin);
        Events.unsubscribe(SIGNIN_USER, this._handlers.signinUser);
    }
    /**
     * Отрисовка страницы авторизации
     */
    render() {
        this.page.innerHTML = signinTemplate();

        const form = document.getElementById('signinform');
        form.addEventListener('submit', this._handlers.submitSigninForm);
    }
    /**
     * Отрисовка сообщения об ошибке
     * @param {string} errstr - ощибка, которую нужно отобразить
     */
    renderError(errstr = '') {
        if (this._model.timerId !== -1) {
            clearTimeout(this._model.timerId);
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = errstr;

        this._model.timerId = setTimeout(() => {
            errLine.textContent = '';
            const loginElem = document.getElementById('signin-login');
            // тут не очевидно, так что поясню.
            // Если отрендерится ошибка и пользователь перейдет на другую страницу до того как эта ошибка пропадет,
            // выполнится следующий код, но уже на новой странице, на которой нет html-тегов,
            // котрые используются функцией. Бах, и jserror в консоль! Но мы это предвидим :) и проверяем, есть ли
            // нужные теги(одного достаточно на самом деле) на странице
            if (loginElem !== null) {
                loginElem.className = 'input-sign';
                document.getElementById('signin-password').className = 'input-sign';
            }
            this._model.timerId = -1;
        }, 5000);
    }
    /**
     * Скрытие страницы страницы авторизации
     */
    hide() {
        const form = document.getElementById('signinform');
        if (!form) {
            return;
        }
        form.removeEventListener('submit', this._handlers.submitSigninForm);
        this.page.innerHTML = '';
    }
}

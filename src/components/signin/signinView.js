import PageView from '../basic/pageView';
import Events from '../../helpers/eventbus/eventbus';
import {
    SUBMIT_SIGNIN,
    ERROR_SIGNIN,
    SIGNIN_USER,
    REDIRECT,
} from '../../helpers/eventbus/constants';

import signinTemplate from './templates/templateSignin.hbs';

/** Класс представления для страницы авторизации */
export default class SigninView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {SigninModel} model - модель
     */
    constructor(parent, model) {
        super(parent);

        this._model = model;

        this._makeHandlers();
    }
    /**
     * Подписка на события страницы авторизации
     */
    subscribeEvents() {
        Events.subscribe(ERROR_SIGNIN, this._handlers.renderErr);
        Events.subscribe(SIGNIN_USER, this._handlers.signinUser);
    }
    /**
     * Отписка от событий страницы авторизации
     */
    unsubscribeEvents() {
        Events.unsubscribe(ERROR_SIGNIN, this._handlers.renderErr);
        Events.unsubscribe(SIGNIN_USER, this._handlers.signinUser);
    }
    /**
     * Функция создает и заполняет поле _handlers обработчиками событий
     */
    _makeHandlers() {
        this._handlers = {
            renderErr: (arg) => {
                this.renderError(arg);
            },
            signinUser: (isAuth) => {
                if (isAuth) {
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
     * @param {Number} numberInputErr 1 - логин, 2 пароль
     */
    renderError(errstr, numberInputErr = 0) {
        if (this._model.timerId !== -1) {
            clearTimeout(this._model.timerId);
        }
        if (numberInputErr === 1) {
            document.getElementById('signin-login').className = 'input-error';
        }
        if (numberInputErr === 2) {
            document.getElementById('signin-password').className = 'input-error';
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

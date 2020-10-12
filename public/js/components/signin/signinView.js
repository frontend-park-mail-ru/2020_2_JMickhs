import SigninModel from './signinModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    SUBMIT_SIGNIN,
    ERR_LOGIN_SINGIN,
    ERR_PASSWORD_SINGIN,
    ERROR_SIGNIN,
} from '../../helpers/eventbus-const/constants';

// eslint-disable-next-line no-undef
const signinTemplate = require('./templateSignin.hbs');

/** Класс представления для страницы авторизации */
export default class SigninView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        if (parent instanceof HTMLElement && model instanceof SigninModel) {
            this._parent = parent;
            this._model = model;
        }
        Events.subscribe(ERROR_SIGNIN, (arg) => {
            this.renderError(arg);
        });

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
    }
    /**
     * Отрисовка страницы авторизации
     */
    render() {
        this.page.innerHTML = signinTemplate();

        const form = document.getElementById('signinform');
        const loginInput = document.getElementById('login');
        const passInput = document.getElementById('password');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const password = passInput.value;
            document.getElementById('login').className = 'input-sign';
            document.getElementById('password').className = 'input-sign';
            Events.trigger(SUBMIT_SIGNIN, {login: login, password: password});
        });

        Events.subscribe(ERR_LOGIN_SINGIN, (arg) => {
            document.getElementById('login').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe(ERR_PASSWORD_SINGIN, (arg) => {
            document.getElementById('password').className = 'input-error';
            this.renderError(arg);
        });
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
            document.getElementById('login').className = 'input-sign';
            document.getElementById('password').className = 'input-sign';
            this._model.timerId = -1;
        }, 5000);
    }
}

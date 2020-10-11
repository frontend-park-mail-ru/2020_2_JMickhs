import SignupModel from './signupModel';
import Events from './../../helpers/eventbus/eventbus';

// eslint-disable-next-line no-undef
const signupTemplate = require('./templateSignup.hbs');

/** Класс представления для страницы регистрации */
export default class SignupView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this.submitEvent = 'submitEvent';
        if (parent instanceof HTMLElement && model instanceof SignupModel) {
            this._parent = parent;
            this._model = model;
        }
        Events.subscribe('errorSignup', (arg) => {
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
     * Отрисовка страницы регистрации
     */
    render() {
        this.page.innerHTML = signupTemplate();

        const form = document.getElementById('signupform');
        const loginInput = document.getElementById('login');
        const passInput1 = document.getElementById('password1');
        const passInput2 = document.getElementById('password2');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const pass1 = passInput1.value;
            const pass2 = passInput2.value;
            document.getElementById('login').className = 'input-sign';
            document.getElementById('password1').className = 'input-sign';
            document.getElementById('password2').className = 'input-sign';
            Events.trigger('submitSignup', {login: login, password1: pass1, password2: pass2});
        });

        Events.subscribe('errLogin', (arg) => {
            document.getElementById('login').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe('errPassword1', (arg) => {
            document.getElementById('password1').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe('errPassword2', (arg) => {
            document.getElementById('password2').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe('errPassword', (arg) => {
            document.getElementById('password1').className = 'input-error';
            document.getElementById('password2').className = 'input-error';
            this.renderError(arg);
        });
    }
    /**
     * Отрисовка сообщения об ошибке
     * @param {string} [errstr=''] - текст ошибки
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
            document.getElementById('password1').className = 'input-sign';
            document.getElementById('password2').className = 'input-sign';
            this._model.timerId = -1;
        }, 5000);
    }
}

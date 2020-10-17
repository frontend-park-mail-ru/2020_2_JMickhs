import SignupModel from './signupModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERR_LOGIN_SINGUP,
    ERR_EMAIL_SINGUP,
    ERR_PASSWORD_SINGUP,
    ERROR_SIGNUP,
    SUBMIT_SIGNUP,
} from '../../helpers/eventbus/constants';

// eslint-disable-next-line no-undef
const signupTemplate = require('./templateSignup.hbs');
// eslint-disable-next-line no-undef
const promtTemplate = require('./tempalatePromt.hbs');

/** Класс представления для страницы регистрации */
export default class SignupView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._handlers = {
            errSignup: (arg) => {
                this.renderError(arg);
            },
            errLoginSignup: (arg) => {
                document.getElementById('signup-login').className = 'input-error';
                this.renderError(arg);
            },
            errEmailSignup: (arg) => {
                document.getElementById('signup-email').className = 'input-error';
                this.renderError(arg);
            },
            errPswSignup: (arg) => {
                document.getElementById('signup-password1').className = 'input-error';
                document.getElementById('signup-password2').className = 'input-error';
                this.renderError(arg);
            },
            submitSignup: (arg) => {
                const pass1 = arg.password1;
                const pass2 = arg.password2;
                const login = arg.login;
                const email = arg.email;
                this._model.validate(login, pass1, pass2, email);
            },
            clickLoginInput: () => {
                if (document.getElementById('login-promt')) {
                    return;
                }
                const form = document.getElementById('signupform');
                const loginInput = document.getElementById('signup-login');
                const passPromt = document.getElementById('pass-promt');
                if (passPromt) {
                    form.removeChild(passPromt);
                }
                const promts = [];
                promts.push({text: 'Логин может включать только буквы, цифры и символы _ - .'});
                promts.push({text: 'Длинна логина должна быть в пределе от 3 до 15 символов'});
                const promt = document.createElement('div');
                promt.id = 'login-promt';
                promt.innerHTML = promtTemplate(promts);
                form.insertBefore(promt, loginInput);
            },
            clickPassInput: () => {
                if (document.getElementById('pass-promt')) {
                    return;
                }
                const form = document.getElementById('signupform');
                const passInput1 = document.getElementById('signup-password1');
                const loginPromt = document.getElementById('login-promt');
                if (loginPromt) {
                    form.removeChild(loginPromt);
                }
                const promts = [];
                promts.push({text: 'Пароль может включать только буквы английского алфавита'});
                promts.push({text: 'Длинна пароля должна быть в пределах от 5 до 30 символов'});
                const promt = document.createElement('div');
                promt.id = 'pass-promt';
                promt.innerHTML = promtTemplate(promts);
                form.insertBefore(promt, passInput1);
            },
            submitSignupForm: (evt) => {
                evt.preventDefault();
                const loginInput = document.getElementById('signup-login');
                const emailInput = document.getElementById('signup-email');
                const passInput1 = document.getElementById('signup-password1');
                const passInput2 = document.getElementById('signup-password2');
                const login = loginInput.value;
                const email = emailInput.value;
                const pass1 = passInput1.value;
                const pass2 = passInput2.value;
                document.getElementById('signup-login').className = 'input-sign';
                document.getElementById('signup-password1').className = 'input-sign';
                document.getElementById('signup-password2').className = 'input-sign';
                Events.trigger(SUBMIT_SIGNUP, {login: login, email: email, password1: pass1, password2: pass2});
            },
        };

        if (parent instanceof HTMLElement && model instanceof SignupModel) {
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
     * Подписка на события списка отелей
     */
    subscribeEvents() {
        Events.subscribe(ERROR_SIGNUP, this._handlers.errSignup);
        Events.subscribe(ERR_LOGIN_SINGUP, this._handlers.errLoginSignup);
        Events.subscribe(ERR_EMAIL_SINGUP, this._handlers.errEmailSignup);
        Events.subscribe(ERR_PASSWORD_SINGUP, this._handlers.errPswSignup);
        Events.subscribe(SUBMIT_SIGNUP, this._handlers.submitSignup);
    }
    /**
     * Отписка от событий списка отелей
     */
    unsubscribeEvents() {
        Events.unsubscribe(ERROR_SIGNUP, this._handlers.errSignup);
        Events.unsubscribe(ERR_LOGIN_SINGUP, this._handlers.errLoginSignup);
        Events.unsubscribe(ERR_EMAIL_SINGUP, this._handlers.errEmailSignup);
        Events.unsubscribe(ERR_PASSWORD_SINGUP, this._handlers.errPswSignup);
        Events.unsubscribe(SUBMIT_SIGNUP, this._handlers.submitSignup);
    }
    /**
     * Отрисовка страницы регистрации
     */
    render() {
        this.page.innerHTML = signupTemplate();

        const form = document.getElementById('signupform');
        const loginInput = document.getElementById('signup-login');
        const passInput1 = document.getElementById('signup-password1');
        const passInput2 = document.getElementById('signup-password2');

        loginInput.addEventListener('click', this._handlers.clickLoginInput);
        passInput1.addEventListener('click', this._handlers.clickPassInput);
        passInput2.addEventListener('click', this._handlers.clickPassInput);
        form.addEventListener('submit', this._handlers.submitSignupForm);
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
            const loginElem = document.getElementById('signup-login');
            // тут не очевидно, но писать снова мне лень, так что см. одноименную ф-цию в signinView.js
            if (loginElem !== null) {
                loginElem.className = 'input-sign';
                document.getElementById('signup-password1').className = 'input-sign';
                document.getElementById('signup-email').className = 'input-sign';
                document.getElementById('signup-password2').className = 'input-sign';
            }
            this._model.timerId = -1;
        }, 5000);
    }
    /**
     * Скрытие страницы списка отелей
     */
    hide() {
        const form = document.getElementById('signupform');
        const loginInput = document.getElementById('signup-login');
        const passInput1 = document.getElementById('signup-password1');
        const passInput2 = document.getElementById('signup-password2');

        loginInput.removeEventListener('click', this._handlers.clickLoginInput);
        passInput1.removeEventListener('click', this._handlers.clickPassInput);
        passInput2.removeEventListener('click', this._handlers.clickPassInput);
        form.removeEventListener('submit', this._handlers.submitSignupForm);

        this.page.innerHTML = '';
    }
}

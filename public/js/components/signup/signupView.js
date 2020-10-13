import SignupModel from './signupModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERR_LOGIN_SINGUP,
    ERR_PASSWORD1_SINGUP,
    ERR_PASSWORD2_SINGUP,
    ERR_PASSWORD_SINGUP, ERROR_SIGNUP,
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
        if (parent instanceof HTMLElement && model instanceof SignupModel) {
            this._parent = parent;
            this._model = model;
        }
        Events.subscribe(ERROR_SIGNUP, (arg) => {
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
        this.subscribeEvents();
    }
    /**
     * Подписка на все необходимые события
     */
    subscribeEvents() {
        const form = document.getElementById('signupform');
        const loginInput = document.getElementById('login');
        const emailInput = document.getElementById('email');
        const passInput1 = document.getElementById('password1');
        const passInput2 = document.getElementById('password2');

        // eslint-disable-next-line no-undef
        this._eventHandlers = new Map();

        const clickLoginInput = () => {
            if (document.getElementById('login-promt')) {
                return;
            }
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
        };

        this._eventHandlers.set(loginInput.id, clickLoginInput);
        loginInput.addEventListener('click', clickLoginInput);

        const clickPassInput = () => {
            if (document.getElementById('pass-promt')) {
                return;
            }
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
        };

        this._eventHandlers.set(passInput1.id, clickLoginInput);
        passInput1.addEventListener('click', clickPassInput);
        this._eventHandlers.set(passInput2.id, clickLoginInput);
        passInput2.addEventListener('click', clickPassInput);

        const submitSignupForm = (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const email = emailInput.value;
            const pass1 = passInput1.value;
            const pass2 = passInput2.value;
            document.getElementById('login').className = 'input-sign';
            document.getElementById('password1').className = 'input-sign';
            document.getElementById('password2').className = 'input-sign';
            Events.trigger(SUBMIT_SIGNUP, {login: login, email: email, password1: pass1, password2: pass2});
        };

        this._eventHandlers.set(form.id, clickLoginInput);
        form.addEventListener('submit', submitSignupForm);

        Events.subscribe(ERR_LOGIN_SINGUP, (arg) => {
            document.getElementById('login').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe(ERR_PASSWORD1_SINGUP, (arg) => {
            document.getElementById('password1').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe(ERR_PASSWORD2_SINGUP, (arg) => {
            document.getElementById('password2').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe(ERR_PASSWORD_SINGUP, (arg) => {
            document.getElementById('password1').className = 'input-error';
            document.getElementById('password2').className = 'input-error';
            this.renderError(arg);
        });
    }
    /**
     * Спрятать вьюшку
     */
    hide() {
        this.unsubscribeEvents();
        this.page.innerHTML = '';
    }
    /**
     * Отписка от всех событий
     */
    unsubscribeEvents() {
        Events.unsubscribeAll('errLoginSignup');
        Events.unsubscribeAll('errPassword1Signup');
        Events.unsubscribeAll('errPassword2Signup');
        Events.unsubscribeAll('errPasswordSignup');

        // const form = document.getElementById('signupform');
        // const loginInput = document.getElementById('login');
        // const passInput1 = document.getElementById('password1');
        // const passInput2 = document.getElementById('password2');

        // form.removeEventListener(this._eventHandlers.get(form.id));
        // loginInput.removeEventListener(this._eventHandlers.get(loginInput.id));
        // passInput1.removeEventListener(this._eventHandlers.get(passInput1.id));
        // passInput2.removeEventListener(this._eventHandlers.get(passInput2.id));
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

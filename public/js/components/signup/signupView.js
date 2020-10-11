import SignupModel from './signupModel';
import Events from './../../helpers/eventbus/eventbus';

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

        loginInput.addEventListener('click', () => {
            if (document.getElementById('login-promt')) {
                return;
            }
            const passPromt = document.getElementById('pass-promt');
            if (passPromt) {
                form.removeChild(passPromt);
            }
            const promts = [];
            promts.push({text: 'Логин должен начинаться с буквы'});
            promts.push({text: 'Логин может включать только буквы, цифры и символы _ - .'});
            promts.push({text: 'Длинна логина должна быть в пределе от 3 до 15 символов'});
            const promt = document.createElement('div');
            promt.id = 'login-promt';
            promt.innerHTML = promtTemplate(promts);
            form.insertBefore(promt, loginInput);
        });

        passInput1.addEventListener('click', () => {
            if (document.getElementById('pass-promt')) {
                return;
            }
            const loginPromt = document.getElementById('login-promt');
            if (loginPromt) {
                form.removeChild(loginPromt);
            }
            const promts = [];
            promts.push({text: 'Пароль может включать только буквы английского алфавита'});
            promts.push({text: 'Длинна пароля должна быть в пределах от 8 до 20 символов'});
            const promt = document.createElement('div');
            promt.id = 'pass-promt';
            promt.innerHTML = promtTemplate(promts);
            form.insertBefore(promt, passInput1);
        });

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

        Events.subscribe('errLoginSignup', (arg) => {
            document.getElementById('login').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe('errPassword1Signup', (arg) => {
            document.getElementById('password1').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe('errPassword2Signup', (arg) => {
            document.getElementById('password2').className = 'input-error';
            this.renderError(arg);
        });
        Events.subscribe('errPasswordSignup', (arg) => {
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

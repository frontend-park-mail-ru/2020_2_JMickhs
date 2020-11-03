import {PageView} from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {
    ERROR_SIGNUP,
    SUBMIT_SIGNUP,
    SIGNUP_USER,
    REDIRECT_BACK,
} from '@eventBus/constants';

import signupTemplate from '@sign/templates/signup.hbs';
import promtTemplate from '@sign/templates/signupPromt.hbs';

/** Класс представления для страницы регистрации */
export default class SignupView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        super(parent);

        this._model = model;

        this._handlers = this._makeHandlers();
    }
    /**
     * Функция создает обработчики событий
     * @return {Object} - возвращает обьект с обработчиками
     */
    _makeHandlers() {
        const handlers = {
            userSignup: (isAuth) => {
                if (isAuth) {
                    Events.trigger(REDIRECT_BACK);
                } else {
                    Events.trigger(ERROR_SIGNUP, 'Вы не смогли зарегистрироваться =)');
                }
            },
            errSignup: (arg) => {
                this.renderError(arg);
            },
            clickLoginInput: this._clickLoginInput.bind(this),
            clickPassInput: this._clickPswInput.bind(this),
            submitSignupForm: this._submitSignup.bind(this),
        };
        return handlers;
    }
    /**
     * Обработчик сабмита формы
     * @param {Event} evt - евент сабмита
     */
    _submitSignup(evt) {
        evt.preventDefault();
        const loginInput = document.getElementById('signup-login');
        const emailInput = document.getElementById('signup-email');
        const passInput1 = document.getElementById('signup-password1');
        const passInput2 = document.getElementById('signup-password2');

        const login = loginInput.value;
        const email = emailInput.value;
        const pass1 = passInput1.value;
        const pass2 = passInput2.value;

        loginInput.className = 'sign__input';
        emailInput.className = 'sign__input';
        passInput1.className = 'sign__input';
        passInput2.className = 'sign__input';

        Events.trigger(SUBMIT_SIGNUP, {login: login, email: email, psw1: pass1, psw2: pass2});
    }
    /**
     * Обработчик клика по инпуту пароля
     */
    _clickPswInput() {
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
        promts.push({text: 'Пароль может включать только буквы английского алфавита и цифры'});
        promts.push({text: 'Длина пароля должна быть в пределах от 5 до 30 символов'});
        const promt = document.createElement('div');
        promt.id = 'pass-promt';
        promt.innerHTML = promtTemplate(promts);
        form.insertBefore(promt, passInput1);
    }
    /**
     * Обработчик клика по инпуту логина
     */
    _clickLoginInput() {
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
        promts.push({text: 'Длина логина должна быть в пределе от 3 до 15 символов'});
        const promt = document.createElement('div');
        promt.id = 'login-promt';
        promt.innerHTML = promtTemplate(promts);
        form.insertBefore(promt, loginInput);
    }
    /**
     * Подписка на события страницы регистрации
     */
    subscribeEvents() {
        Events.subscribe(ERROR_SIGNUP, this._handlers.errSignup);
        Events.subscribe(SIGNUP_USER, this._handlers.userSignup);
    }
    /**
     * Отписка от событий сраницы регистрации
     */
    unsubscribeEvents() {
        Events.unsubscribe(ERROR_SIGNUP, this._handlers.errSignup);
        Events.unsubscribe(SIGNUP_USER, this._handlers.userSignup);
    }
    /**
     * Отрисовка страницы регистрации
     */
    render() {
        window.scrollTo(0, 0);
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
     * @param {string} errstr - ощибка, которую нужно отобразить
     * @param {Number} numberInputErr 1 - логин, 2 email, 3 - пароль
     */
    renderError(errstr, numberInputErr = 0) {
        if (this._model.timerId !== -1) {
            clearTimeout(this._model.timerId);
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = errstr;

        switch (numberInputErr) {
        case 1: {
            document.getElementById('signup-login').className += ' sign__input--error';
            break;
        }
        case 2: {
            document.getElementById('signup-email').className += ' sign__input--error';
            break;
        }
        case 3: {
            document.getElementById('signup-password1').className += ' sign__input--error';
            document.getElementById('signup-password2').className += ' sign__input--error';
            break;
        }
        }

        this._model.timerId = setTimeout(() => {
            errLine.textContent = '';
            const loginElem = document.getElementById('signup-login');
            // тут не очевидно, но писать снова мне лень, так что см. одноименную ф-цию в signinView.js
            if (loginElem !== null) {
                loginElem.className = 'sign__input';
                document.getElementById('signup-password1').className = 'sign__input';
                document.getElementById('signup-email').className = 'sign__input';
                document.getElementById('signup-password2').className = 'sign__input';
            }
            this._model.timerId = -1;
        }, 5000);
    }
    /**
     * Скрытие страницы регистрации
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

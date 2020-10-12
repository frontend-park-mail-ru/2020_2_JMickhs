import SignupModel from './signupModel';
import SignupView from './signupView';
import Events from './../../helpers/eventbus/eventbus';
import Validation from '../../helpers/validation/validation';
import {
    ERR_LOGIN_SINGUP,
    ERR_PASSWORD1_SINGUP,
    ERR_PASSWORD2_SINGUP,
    ERR_PASSWORD_SINGUP,
    NAVBAR_ACTIVE,
    PAGE_SIGNUP,
    REDIRECT, SUBMIT_SIGNUP,
} from '../../helpers/eventbus-const/constants';

/** Класс контроллера для страницы регистрации */
export default class SignupController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SignupModel();
        this._view = new SignupView(parent, this._model);
        Events.subscribe(SUBMIT_SIGNUP, (arg) => {
            const pass1 = arg.password1;
            const pass2 = arg.password2;
            const login = arg.login;
            this.validate(login, pass1, pass2);
        });
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger(PAGE_SIGNUP);
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth()) {
            Events.trigger(REDIRECT, {url: '/profile'});
            return;
        }
        this._view.render();
    }

    /**
     * Валидация формы
     * @param {string} login - родительский элемент html-страницы
     * @param {string} pass1 - родительский элемент html-страницы
     * @param {string} pass2 - родительский элемент html-страницы
     */
    validate(login, pass1, pass2) {
        if (login === '' || pass1 === '' || pass2 === '') {
            if (login === '') {
                Events.trigger(ERR_LOGIN_SINGUP, 'Заполните все поля');
            }
            if (pass1 === '') {
                Events.trigger(ERR_PASSWORD1_SINGUP, 'Заполните все поля');
            }
            if (pass2 === '') {
                Events.trigger(ERR_PASSWORD2_SINGUP, 'Заполните все поля');
            }
        } else if (pass1 !== pass2) {
            Events.trigger(ERR_PASSWORD1_SINGUP, 'Пароли не совпадают');
            Events.trigger(ERR_PASSWORD2_SINGUP, 'Пароли не совпадают');
        } else if (
            Validation.validateLogin(login, ERR_LOGIN_SINGUP) &&
            Validation.validatePassword(pass1, ERR_PASSWORD_SINGUP)
        ) {
            this._model.signup(login, pass1);
        }
    }
}

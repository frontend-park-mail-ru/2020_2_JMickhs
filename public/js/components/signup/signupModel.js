import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERR_EMAIL_SINGUP,
    ERR_LOGIN_SINGUP,
    ERR_PASSWORD_SINGUP,
    ERROR_SIGNUP,
    REDIRECT,
    SIGNUP_USER,
} from '../../helpers/eventbus/constants';
import Validation from '../../helpers/validation/validation';

/** Класс модели для страницы регистрации */
export default class SignupModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel;
        this.timerId = -1;
        Events.subscribe(SIGNUP_USER, () => {
            if (this._user.isAuth) {
                Events.trigger(REDIRECT, {url: '/profile'});
            } else {
                Events.trigger(ERROR_SIGNUP, 'Вы не авторизованы');
            }
        });
    }
    /**
     * Регистрация пользователя
     * @param {string} username - логин
     * @param {string} email - email
     * @param {string} password - пароль
     */
    signup(username, email, password) {
        this._user.signup(username, email, password);
    }
    /**
     * Проверка на то, авторизован ли пользователь
     * @return {boolean} Авторизован ли пользователь
     */
    isAuth() {
        return this._user.isAuth;
    }
    /**
     * Валидация формы
     * @param {string} login - родительский элемент html-страницы
     * @param {string} pass1 - родительский элемент html-страницы
     * @param {string} pass2 - родительский элемент html-страницы
     * @param {string} email - родительский элемент html-страницы
     */
    validate(login, pass1, pass2, email) {
        if (login === '' || pass1 === '' || pass2 === '' || email === '') {
            Events.trigger(ERROR_SIGNUP, 'Заполните все поля');
        } else if (pass1 !== pass2) {
            Events.trigger(ERR_PASSWORD_SINGUP, 'Пароли не совпадают');
        } else if (
            Validation.validateLogin(login, ERR_LOGIN_SINGUP) &&
            Validation.validatePassword(pass1, ERR_PASSWORD_SINGUP) &&
            Validation.validateEmail(email, ERR_EMAIL_SINGUP)
        ) {
            this.signup(login, email, pass1);
        }
    }
}

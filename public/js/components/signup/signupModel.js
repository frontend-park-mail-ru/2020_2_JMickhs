import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERROR_SIGNUP,
    REDIRECT, SIGNUP_USER,
} from '../../helpers/eventbus/constants';

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
}

import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERROR_SIGNUP,
    REDIRECT, SIGNUP_USER,
} from '../../helpers/eventbus-const/constants';

/** Класс модели для страницы регистрации */
export default class SignupModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        Events.subscribe(SIGNUP_USER, () => {
            if (this._user.isAuth) {
                Events.trigger(REDIRECT, {url: '/profile'});
            } else {
                Events.trigger(ERROR_SIGNUP, 'You are not authenticated');
            }
        });
    }
    /**
     * Регистрация пользователя
     * @param {string} username - логин
     * @param {string} password - пароль
     */
    signup(username, password) {
        this._user.signup(username, password);
    }
    /**
     * Проверка на то, авторизован ли пользователь
     * @return {boolean} Авторизован ли пользователь
     */
    isAuth() {
        return this._user.isAuth;
    }
}

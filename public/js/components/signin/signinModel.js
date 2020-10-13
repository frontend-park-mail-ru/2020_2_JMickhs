import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';
import {
    REDIRECT,
    SIGNIN_USER,
    ERROR_SIGNIN,
} from '../../helpers/eventbus/constants';

/** Класс модели для страницы авторизации */
export default class SigninModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        Events.subscribe(SIGNIN_USER, () => {
            if (this._user.isAuth) {
                Events.trigger(REDIRECT, {url: '/profile'});
            } else {
                Events.trigger(ERROR_SIGNIN, 'Неверный логин или пароль!');
            }
        });
    }
    /**
     * Авторизация пользователя
     * @param {string} username - логин
     * @param {string} password - пароль
     */
    signin(username, password) {
        this._user.signin(username, password);
    }
    /**
     * Проверка на то, авторизован ли пользователь
     * @return {boolean} Авторизован ли пользователь
     */
    isAuth() {
        return this._user.isAuth;
    }
}

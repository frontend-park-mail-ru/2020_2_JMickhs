import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';

/** Класс модели для страницы регистрации */
export default class SignupModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        Events.subscribe('signupUser', () => {
            if (this._user.isAuth) {
                Events.trigger('redirect', {url: '/profile'});
            } else {
                Events.trigger('errorSignup', 'You are not authenticated');
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

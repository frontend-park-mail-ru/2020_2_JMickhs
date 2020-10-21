import ProfileModel from 'profile/profileModel';

/** Класс модели для страницы авторизации */
export default class SigninModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel;
        this.timerId = -1;
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

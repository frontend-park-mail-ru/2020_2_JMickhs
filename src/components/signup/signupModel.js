import ProfileModel from 'profile/profileModel';

/** Класс модели для страницы регистрации */
export default class SignupModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel;
        this.timerId = -1;
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

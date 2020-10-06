import ProfileModel from '../profile/profileModel';

/** Класс модели для страницы авторизации */
export default class SigninModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        EventBus.subscribe('signinUser', () => {
            if (this._user.isAuth) {
                router.pushState('/profile');
            } else {
                EventBus.trigger('errorSignin', 'Неверный логин или пароль!');
            }
        });
    }
    /**
     * Авторизация пользователя
     */
    signin(username, password) {
        this._user.signin(username, password);
    }
    /**
     * Проверка на то, авторизован ли пользователь
     */
    isAuth() {
        return this._user.isAuth;
    }
}
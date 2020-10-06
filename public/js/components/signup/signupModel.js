import ProfileModel from '../profile/profileModel';

/** Класс модели для страницы регистрации */
export default class SignupModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        EventBus.subscribe('signupUser', () => {
            if (this._user.isAuth) {
                router.pushState('/profile');
            } else {
                EventBus.trigger('errorSignup', 'You are not authenticated');
            }
        });
    }
    /**
     * Регистрация пользователя
     */
    signup(username, password) {
        this._user.signup(username, password);
    }
    /**
     * Проверка на то, авторизован ли пользователь
     */
    isAuth() {
        return this._user.isAuth;
    }
}

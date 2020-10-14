import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';
import {
    SIGNOUT,
    ABSTRACT_ALL_DEAD,
    PROFILE_USER,
    UPDATE_USER,
    UPDATE_AVATAR,
    SIGNIN_USER,
    ERROR_SIGNIN,
    SIGNUP_USER,
    ERROR_SIGNUP,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    REDIRECT, ERR_UPDATE_AVATAR,
} from '../../helpers/eventbus/constants';

/** Класс модели пользователя */
class UserModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this.login = '';
        this.id = -1;
        this.isAuth = false;
        this.avatar = '';
        this.timerId = -1;
    }
    /**
     * Запросить с сервера информацию о пользователе
     */
    getCurrUser() {
        const response = Net.user();
        response.then((response) => {
            const status = response.status;
            const data = response.data;
            switch (status) {
            case 200:
                this.isAuth = true;
                this.login = data.username;
                this.id = data.id;
                this.avatar = data.avatar;
                Events.trigger(UPDATE_USER);
                Events.trigger(PROFILE_USER);
                break;
            case 401:
                this.isAuth = false;
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            default:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            }
        });
    }
    /**
     * Обновить аватар(и все сведения о пользователе)
     * @param {FormData} formAvatar - форма аватарки
     */
    updateAvatar(formAvatar) {
        let userResponse;
        const avaResponse = Net.updateAvatar(new FormData(formAvatar));
        avaResponse.then((response) => {
            const status = response.status;
            switch (status) {
            case 200:
                userResponse = Net.user();
                userResponse.then((response) => {
                    const status = response.status;
                    const data = response.data;
                    switch (status) {
                    case 200:
                        this.isAuth = true;
                        this.login = data.username;
                        this.id = data.id;
                        this.avatar = data.avatar;
                        Events.trigger(UPDATE_AVATAR);
                        break;
                    case 401:
                        this.isAuth = false;
                        Events.trigger(REDIRECT, {url: '/signin'});
                        break;
                    default:
                        Events.trigger(ABSTRACT_ALL_DEAD);
                        break;
                    }
                });
                break;
            case 400:
                Events.trigger(ERR_UPDATE_AVATAR, 'Неверный формат запроса');
                break;
            case 401:
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            case 403:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            case 415:
                Events.trigger(ERR_UPDATE_AVATAR, 'Можно загружать только файлы с расширением jpg, png');
                break;
            default:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            }
        }).catch(() => {
            Events.trigger(ERR_UPDATE_AVATAR, 'Аватарку обновить не получилось!');
        });
    }
    /**
     * Авторизация пользователя
     * @param {string} username - логин пользователя
     * @param {string} password - пароль пользователя
     */
    signin(username, password) {
        const response = Net.signin(username, password);
        response.then((response) => {
            const status = response.status;
            const data = response.data;
            switch (status) {
            case 200:
                this.isAuth = true;
                this.id = data.id;
                this.avatar = data.avatar;
                this.login = data.username;
                Events.trigger(UPDATE_USER);
                Events.trigger(SIGNIN_USER);
                break;
            case 400:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            case 401:
                Events.trigger(ERROR_SIGNIN, 'Вы ввели неправильный логин или пароль');
                break;
            default:
                Events.trigger(ERROR_SIGNIN, `Ошибка сервера: статус - ${status}`);
                break;
            }
        });
    }
    /**
     * Регистрация пользователя
     * @param {string} username - логин пользователя
     * @param {string} email - пароль пользователя
     * @param {string} password - пароль пользователя
     */
    signup(username, email, password) {
        const response = Net.signup(username, email, password);
        response.then((response) => {
            const status = response.status;
            const data = response.data;
            switch (status) {
            case 200:
                this.id = data.id;
                this.avatar = data.avatar;
                this.isAuth = true;
                this.login = data.username;
                Events.trigger(UPDATE_USER);
                Events.trigger(SIGNUP_USER);
                break;
            case 400:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            case 409:
                Events.trigger(ERROR_SIGNUP, 'Пользователь с таким логином уже существует!');
                break;
            default:
                Events.trigger(ERROR_SIGNUP, `Ошибка сервера: статус ${status}`);
                break;
            }
        });
    }
    /**
     * Деавторизация пользователя
     */
    signout() {
        const response = Net.signout();
        response.then((r) => {
            const status = r.status;
            switch (status) {
            case 200:
                this.id = -1;
                this.username = '';
                this.isAuth = false;
                this.avatar = '';
                Events.trigger(SIGNOUT);
                break;
            default:
                Events.trigger(ERROR_SIGNUP, `Ошибка сервера: статус ${status}`);
                break;
            }
        });
    }
    /**
     * Смена пароля
     * @param {string} oldPassword - старый пароль
     * @param {string} password - новый пароль
     */
    updatePassword(oldPassword, password) {
        const response = Net.updatePassword(oldPassword, password);
        response.then((r) => {
            const status = r.status;
            switch (status) {
            case 200:
                Events.trigger(GET_NEW_PASSWORD);
                break;
            case 400:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            case 401:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            case 402:
                Events.trigger(PASSWORD_UPDATE_ERROR, 'Вы ввели неверный пароль');
                break;
            case 403:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            default:
                Events.trigger(ABSTRACT_ALL_DEAD);
                break;
            }
        });
    }
}

/** Класс модели для страницы профиля */
export default class ProfileModel {
    /**
     * Создание singleton-объекта модели пользователя
     */
    static get instance() {
        return this._instance || (this._instance = new UserModel());
    }
}

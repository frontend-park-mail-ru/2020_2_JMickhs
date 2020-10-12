import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';
import {
    SIGNOUT,
    HAVNT_USER,
    PROFILE_USER,
    UPDATE_USER,
    UPDATE_AVATAR,
    SIGNIN_USER,
    ERROR_SIGNIN,
    SIGNUP_USER,
    ERROR_SIGNUP,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
} from '../../helpers/eventbus-const/constants';

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
            const err = response.error;
            if (err === undefined && status === 200) {
                this.isAuth = true;
                this.login = data.username;
                this.id = data.id;
                this.avatar = data.avatar;
                Events.trigger(UPDATE_USER);
                Events.trigger(PROFILE_USER);
            } else {
                Events.trigger(HAVNT_USER);
            }
        });
    }
    /**
     * Обновить аватар(и все сведения о пользователе)
     */
    updateAvatar() {
        const response = Net.user();
        response.then((response) => {
            const status = response.status;
            const data = response.data;
            const err = response.error;
            if (status === 200 && err === undefined) {
                this.isAuth = true;
                this.login = data.username;
                this.id = data.id;
                this.avatar = data.avatar;
                Events.trigger(UPDATE_AVATAR);
            }
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
            const err = response.error;
            const data = response.data;
            if (status === 200 && err === undefined) {
                this.isAuth = true;
                this.id = data.id;
                this.avatar = data.avatar;
                this.login = data.username;
                Events.trigger(UPDATE_USER);
                Events.trigger(SIGNIN_USER);
            } else if (err.code === 401) {
                Events.trigger(ERROR_SIGNIN, 'Вы ввели неправильный логин или пароль');
            } else {
                Events.trigger(ERROR_SIGNIN, `Ошибка сервера: статус - ${err.code}`);
            }
        });
    }
    /**
     * Регистрация пользователя
     * @param {string} username - логин пользователя
     * @param {string} password - пароль пользователя
     */
    signup(username, password) {
        const response = Net.signup(username, password);
        response.then((response) => {
            const status = response.status;
            const err = response.error;
            const data = response.data;
            if (status === 200 && err === undefined) {
                this.id = data.id;
                this.avatar = data.avatar;
                this.isAuth = true;
                this.login = data.username;
                Events.trigger(UPDATE_USER);
                Events.trigger(SIGNUP_USER);
            } else if (err.code === 500) {
                Events.trigger(ERROR_SIGNUP, 'Пользователь с таким логином уже существует!',
                );
            } else {
                Events.trigger(ERROR_SIGNUP, `Ошибка сервера: статус ${status}`);
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
            if (status === 200) {
                this.id = -1;
                this.username = '';
                this.isAuth = false;
                this.avatar = '';
                Events.trigger(SIGNOUT);
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
            const err = r.error;
            const status = r.status;
            if (status === 200 && err.code === undefined) {
                Events.trigger(GET_NEW_PASSWORD);
                return;
            }
            Events.trigger(PASSWORD_UPDATE_ERROR, 'Вы ввели неверный пароль');
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

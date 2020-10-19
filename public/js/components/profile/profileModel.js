import Net from '../../helpers/network/network';
import Events from './../../helpers/eventbus/eventbus';
import {
    SIGNOUT,
    PROFILE_USER,
    UPDATE_USER,
    UPDATE_AVATAR,
    SIGNIN_USER,
    ERROR_SIGNIN,
    SIGNUP_USER,
    ERROR_SIGNUP,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    REDIRECT,
    ERR_UPDATE_AVATAR,
    REDIRECT_ERROR,
    HAVNT_USER,
    FIX_USER,
    ERR_FIX_USER,
} from '../../helpers/eventbus/constants';

/** Класс модели пользователя */
class ProfileModel {
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
            const code = response.code;
            const data = response.data;
            switch (code) {
            case 200:
                this.isAuth = true;
                this.login = data.username;
                this.id = data.id;
                this.avatar = data.avatar;
                this.email = data.email;
                Events.trigger(UPDATE_USER);
                Events.trigger(PROFILE_USER);
                break;
            case 401:
                Events.trigger(HAVNT_USER);
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Что-то страшное произошло c нишим сервером...' +
                        ` Он говорит: ${status}`});
                break;
            }
        });
    }
    /**
     * Обновить аватар(и все сведения о пользователе)
     * @param {FormData} formAvatar - форма аватарки
     */
    updateAvatar(formAvatar) {
        const avaResponse = Net.updateAvatar(new FormData(formAvatar));
        avaResponse.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                this.avatar = response.data;
                Events.trigger(UPDATE_AVATAR);
                break;
            case 400:
                Events.trigger(ERR_UPDATE_AVATAR, 'Неверный формат запроса');
                break;
            case 401:
                this.isAuth = false;
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            case 403:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Нет csrf'});
                break;
            case 415:
                Events.trigger(ERR_UPDATE_AVATAR, 'Можно загружать только файлы с расширением jpg, png');
                break;
            default:
                Events.trigger(ERROR_SIGNIN, `Ошибка сервера: статус - ${status}`);
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
            const code = response.code;
            const data = response.data;
            switch (code) {
            case 200:
                this.isAuth = true;
                this.id = data.id;
                this.avatar = data.avatar;
                this.login = data.username;
                this.email = data.email;
                Events.trigger(UPDATE_USER);
                Events.trigger(SIGNIN_USER);
                break;
            case 400:
                Events.trigger(ERROR_SIGNIN, 'Неверный формат запроса');
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
            const code = response.code;
            const data = response.data;
            switch (code) {
            case 200:
                this.id = data.id;
                this.avatar = data.avatar;
                this.isAuth = true;
                this.login = data.username;
                this.email = data.email;
                Events.trigger(UPDATE_USER);
                Events.trigger(SIGNUP_USER);
                break;
            case 400:
                Events.trigger(ERROR_SIGNUP, 'Неверный формат запроса');
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
     * Изменение данных пользователя
     * @param {string} username - логин пользователя
     * @param {string} email - пароль пользователя
     */
    changeUser(username, email) {
        const response = Net.changeUser(username, email);
        response.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                this.login = username;
                this.email = email;
                Events.trigger(FIX_USER);
                break;
            case 400:
                Events.trigger(ERR_FIX_USER, 'Неверный формат запроса');
                break;
            case 401:
                this.isAuth = false;
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            case 403:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Нет csrf'});
                break;
            default:
                Events.trigger(ERR_FIX_USER, `Ошибка сервера: статус ${status}`);
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
            const code = r.code;
            switch (code) {
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
            const code = r.code;
            switch (code) {
            case 200:
                Events.trigger(GET_NEW_PASSWORD);
                break;
            case 400:
                Events.trigger(PASSWORD_UPDATE_ERROR, 'Неверный формат запроса');
                break;
            case 401:
                this.isAuth = false;
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            case 402:
                Events.trigger(PASSWORD_UPDATE_ERROR, 'Вы ввели неверный пароль');
                break;
            case 403:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Нет csrf'});
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Что-то страшное произошло c нишим сервером...' +
                        ` Он говорит: ${status}`});
                break;
            }
        });
    }
}

export default new ProfileModel();

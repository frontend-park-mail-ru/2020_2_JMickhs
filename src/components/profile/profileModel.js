import Net from '@network/network';
import Events from '@eventBus/eventbus';
import {
    SIGNOUT,
    UPDATE_AVATAR,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    REDIRECT,
    ERR_UPDATE_AVATAR,
    REDIRECT_ERROR,
    CHANGE_USER_OK,
    ERR_FIX_USER,
} from '@eventBus/constants';

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
        this.email = '';
    }
    /**
     * Возврщает данные о пользователе
     * @param {Object} data
     */
    setData(data) {
        this.login = data.username;
        this.email = data.email;
        this.id = data.id;
        this.isAuth = data.isAuth;
        this.avatar = data.avatar;
    }
    /**
     * Возврщает данные о пользователе
     * @return {Object}
     */
    getData() {
        return {username: this.login, id: this.id, avatar: this.avatar, isAuth: this.isAuth};
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
                this.avatar = Net.getUrlFile(response.data);
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
                Events.trigger(ERR_UPDATE_AVATAR, `Ошибка сервера: статус - ${status}`);
                break;
            }
        }).catch(() => {
            Events.trigger(ERR_UPDATE_AVATAR, 'Аватарку обновить не получилось!');
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
                Events.trigger(CHANGE_USER_OK, this.getData());
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
            case 409:
                Events.trigger(ERR_FIX_USER, 'Пользователь с такими данными уже зарегистрирован');
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
                Events.trigger(SIGNOUT, `Ошибка сервера: статус ${status}`);
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

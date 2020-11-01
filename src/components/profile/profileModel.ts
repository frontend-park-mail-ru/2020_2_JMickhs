import User from '@user/user';
import NetworkUser from '@network/networkUser';
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

import {UserData} from '@interfaces/structsData/userData';

export default class ProfileModel {
    private user: User;

    constructor() {
        this.user = User.getInstance();
    }

    isAuth(): boolean {
        return this.user.isAuth;
    }

    getData(): UserData {
        return this.user.getData();
    }

    signout(): void {
        const response = NetworkUser.signout();
        response.then((r) => {
            const code = r.code;
            switch (code) {
            case 200:
                this.user.id = -1;
                this.user.username = '';
                this.user.isAuth = false;
                this.user.avatar = '';
                Events.trigger(SIGNOUT);
                break;
            default:
                Events.trigger(SIGNOUT, `Ошибка сервера: статус ${code}`);
                break;
            }
        });
    }

    updateAvatar(formAvatar: HTMLFormElement): void {
        const avaResponse = NetworkUser.updateAvatar(new FormData(formAvatar));
        avaResponse.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                this.user.avatar = response.data as string;
                Events.trigger(UPDATE_AVATAR, this.user.avatar);
                break;
            case 400:
                Events.trigger(ERR_UPDATE_AVATAR, 'Неверный формат запроса');
                break;
            case 401:
                this.user.isAuth = false;
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            case 403:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Нет csrf'});
                break;
            case 415:
                Events.trigger(ERR_UPDATE_AVATAR, 'Можно загружать только файлы с расширением jpg, png');
                break;
            default:
                Events.trigger(ERR_UPDATE_AVATAR, `Ошибка сервера: статус - ${code}`);
                break;
            }
        }).catch(() => {
            Events.trigger(ERR_UPDATE_AVATAR, 'Аватарку обновить не получилось!');
        });
    }

    changeUser(username: string, email: string): void {
        const response = NetworkUser.changeUser(username, email);
        response.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                this.user.username = username;
                this.user.email = email;
                Events.trigger(CHANGE_USER_OK, this.getData());
                break;
            case 400:
                Events.trigger(ERR_FIX_USER, 'Неверный формат запроса');
                break;
            case 401:
                this.user.isAuth = false;
                Events.trigger(REDIRECT, {url: '/signin'});
                break;
            case 403:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Нет csrf'});
                break;
            case 409:
                Events.trigger(ERR_FIX_USER, 'Пользователь с такими данными уже зарегистрирован');
                break;
            default:
                Events.trigger(ERR_FIX_USER, `Ошибка сервера: статус ${code}`);
                break;
            }
        });
    }

    updatePassword(oldPassword: string, password: string): void {
        const response = NetworkUser.updatePassword(oldPassword, password);
        response.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                Events.trigger(GET_NEW_PASSWORD);
                break;
            case 400:
                Events.trigger(PASSWORD_UPDATE_ERROR, 'Неверный формат запроса');
                break;
            case 401:
                this.user.isAuth = false;
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
                        ` Он говорит: ${code}`});
                break;
            }
        });
    }
}

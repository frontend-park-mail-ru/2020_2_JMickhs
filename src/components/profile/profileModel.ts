import User from '@user/user';
import NetworkUser from '@network/networkUser';
import Events from '@eventBus/eventbus';
import {
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    CHANGE_USER_OK,
    ERR_FIX_USER,
} from '@eventBus/constants';

import { UserData } from '@interfaces/structsData/userData';
import Redirector from '@router/redirector';

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

    changeUser(username: string, email: string): void {
        const response = NetworkUser.changeUser(username, email);
        response.then((value) => {
            const { code } = value;
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
                    Redirector.redirectTo('/signin');
                    break;
                case 403:
                    Redirector.redirectError('Нет csrf');
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
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    Events.trigger(GET_NEW_PASSWORD);
                    break;
                case 400:
                    Events.trigger(PASSWORD_UPDATE_ERROR, 'Неверный формат запроса');
                    break;
                case 401:
                    this.user.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 402:
                    Events.trigger(PASSWORD_UPDATE_ERROR, 'Вы ввели неверный пароль');
                    break;
                case 403:
                    Redirector.redirectError('Нет csrf');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера - ${code}`);
                    break;
            }
        });
    }
}

import User from '@user/user';
import NetworkUser from '@network/networkUser';
import Events from '@eventBus/eventbus';
import {
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
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

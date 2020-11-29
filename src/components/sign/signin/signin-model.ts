import User from '@user/user';
import NetworkUser from '@/helpers/network/network-user';
import Events from '@eventbus/eventbus';
import {
    SIGNIN_USER,
    ERROR_SIGNIN,
} from '@eventbus/constants';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';
import {
    ERROR_400,
    ERROR_DEFAULT,
} from '@global-variables/network-error';

const ERROR_SIGNIN_MESSAGE = 'Вы ввели неправильный логин или пароль';

export default class SigninModel {
    private user: typeof User;

    constructor() {
        this.user = User;
    }

    isAuth(): boolean {
        return this.user.isAuth;
    }

    signin(username: string, password: string): void {
        const response = NetworkUser.signin(username, password);
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as UserData;
                    this.user.setData(data);
                    Events.trigger(SIGNIN_USER, this.user.getData());
                    break;
                case 400:
                    Events.trigger(ERROR_SIGNIN, ERROR_400);
                    break;
                case 401:
                    Events.trigger(ERROR_SIGNIN, ERROR_SIGNIN_MESSAGE);
                    break;
                default:
                    Events.trigger(ERROR_SIGNIN, `${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }
}

import User from '@user/user';
import NetworkUser from '@/helpers/network/network-user';
import Events from '@eventbus/eventbus';
import {
    SIGNIN_USER,
    ERROR_SIGNIN,
} from '@eventbus/constants';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';

export default class SigninModel {
    private user: User;

    constructor() {
        this.user = User.getInstance();
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
                    Events.trigger(ERROR_SIGNIN, 'Неверный формат запроса');
                    break;
                case 401:
                    Events.trigger(ERROR_SIGNIN, 'Вы ввели неправильный логин или пароль');
                    break;
                default:
                    Events.trigger(ERROR_SIGNIN, `Ошибка сервера: статус - ${code || value.error}`);
                    break;
            }
        });
    }
}

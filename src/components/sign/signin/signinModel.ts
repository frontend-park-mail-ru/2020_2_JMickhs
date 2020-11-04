import User from '@user/user';
import NetworkUser from '@network/networkUser';
import Events from '@eventBus/eventbus';
import {
    SIGNIN_USER,
    ERROR_SIGNIN,
} from '@eventBus/constants';
import { UserData } from '@interfaces/structsData/userData';

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
                    this.user.isAuth = true;
                    this.user.id = data.id;
                    this.user.avatar = data.avatar;
                    this.user.username = data.username;
                    this.user.email = data.email;
                    Events.trigger(SIGNIN_USER, this.user.getData());
                    break;
                case 400:
                    Events.trigger(ERROR_SIGNIN, 'Неверный формат запроса');
                    break;
                case 401:
                    Events.trigger(ERROR_SIGNIN, 'Вы ввели неправильный логин или пароль');
                    break;
                default:
                    Events.trigger(ERROR_SIGNIN, `Ошибка сервера: статус - ${code}`);
                    break;
            }
        });
    }
}

import User from '@user/user';
import NetworkUser from '@network/networkUser';
import Events from '@eventBus/eventbus';
import {
    SIGNUP_USER,
    ERROR_SIGNUP,
} from '@eventBus/constants';
import { UserData } from '@interfaces/structsData/userData';

export default class SignupModel {
    private user: User;

    constructor() {
        this.user = User.getInstance();
    }

    isAuth(): boolean {
        return this.user.isAuth;
    }

    signup(username: string, email: string, password: string): void {
        const response = NetworkUser.signup(username, email, password);
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as UserData;
                    this.user.setData(data);
                    Events.trigger(SIGNUP_USER, this.user.getData());
                    break;
                case 400:
                    Events.trigger(ERROR_SIGNUP, 'Неверный формат запроса');
                    break;
                case 409:
                    Events.trigger(ERROR_SIGNUP, 'Пользователь с таким логином уже существует!');
                    break;
                default:
                    Events.trigger(ERROR_SIGNUP, `Ошибка сервера: статус ${code}`);
                    break;
            }
        });
    }
}

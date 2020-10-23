import User from '@user/user';
import Network from '@network/network';
import Events from '@eventBus/eventbus';
import {
    SIGNUP_USER,
    ERROR_SIGNUP,
} from '@eventBus/constants';

export default class SignupModel {
    private user: User;

    constructor() {
        this.user = User.getInstance();
    }

    isAuth(): boolean {
        return this.user.isAuth;
    }

    signup(username: string, email: string, password: string): void {
        const response = Network.signup(username, email, password);
        response.then((response) => {
            const code = response.code;
            const data = response.data;
            switch (code) {
            case 200:
                this.user.id = data.id;
                this.user.avatar = Network.getUrlFile(data.avatar);
                this.user.isAuth = true;
                this.user.username = data.username;
                this.user.email = data.email;
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
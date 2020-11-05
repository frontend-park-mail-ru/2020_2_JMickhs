import NetworkUser from '@network/networkUser';
import Events from '@eventBus/eventbus';
import {
    AUTH_USER,
    NOT_AUTH_USER,
} from '@eventBus/constants';
import User from '@user/user';
import { UserData } from '@interfaces/structsData/userData';
import Redirector from '../router/redirector';

export default function userFromCookie(): void {
    const user = User.getInstance();
    const response = NetworkUser.user();
    response.then((value) => {
        const { code } = value;
        const data = value.data as UserData;
        switch (code) {
            case 200:
                user.setData(data);
                Events.trigger(AUTH_USER, user);
                break;
            case 401:
                Events.trigger(NOT_AUTH_USER);
                break;
            default:
                Redirector.redirectError(`Ошибка сервера: ${code}`);
                break;
        }
    });
}

import NetworkUser from '@/helpers/network/network-user';
import Events from '@eventbus/eventbus';
import {
    AUTH_USER,
    NOT_AUTH_USER,
} from '@eventbus/constants';
import User from '@user/user';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';
import Redirector from '../router/redirector';

export default function userFromCookie(): void {
    const user = User.getInstance();
    user.updateWaiting(true);
    const response = NetworkUser.user();
    response.then((value) => {
        const { code } = value;
        const data = value.data as UserData;
        user.updateWaiting(false);
        switch (code) {
            case 200:
                user.setData(data);
                Events.trigger(AUTH_USER, data);
                break;
            case 401:
                user.clear();
                Events.trigger(NOT_AUTH_USER);
                break;
            default:
                user.clear();
                Redirector.redirectError(`Ошибка сервера: ${code || value.error}`);
                break;
        }
    });
}

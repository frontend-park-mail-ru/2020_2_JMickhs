import NetworkUser from '@network/networkUser';
import Events from '@eventBus/eventbus';
import {
    HAVE_USER,
    REDIRECT_ERROR,
    HAVNT_USER,
} from '@eventBus/constants';
import User from '@user/user';
import { UserData } from '../interfaces/structsData/userData';

export default function userFromCookie(): void {
    const user = User.getInstance();
    const response = NetworkUser.user();
    response.then((r) => {
        const code = r.code;
        const data = r.data as UserData;
        switch (code) {
        case 200:
            user.isAuth = true;
            user.username = data.username;
            user.id = data.id;
            user.avatar = data.avatar;
            user.email = data.email;
            Events.trigger(HAVE_USER, user);
            break;
        case 401:
            Events.trigger(HAVNT_USER);
            break;
        default:
            Events.trigger(REDIRECT_ERROR, {url: '/error',
                err: 'Что-то страшное произошло c нишим сервером...' + ` Он говорит: ${code}`
            });
            break;
        }
    });
}
import Network from '@network/network';
import Events from '@eventBus/eventbus';
import {
    HAVE_USER,
    REDIRECT_ERROR,
    HAVNT_USER,
} from '@eventBus/constants';

import {UserData} from '@interfaces/userData';

export default function getUserFromCookie(): Promise<UserData> {
    const user = {
        isAuth: false,
        username: '',
        email: '',
        avatar: '',
        id: -1,
    }
    const response = Network.user();
    return response.then((r) => {
        const code = r.code;
        const data = r.data;
        switch (code) {
        case 200:
            user.isAuth = true;
            user.username = data.username;
            user.id = data.id;
            user.avatar = Network.getUrlFile(data.avatar);
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
        return user;
    })

}
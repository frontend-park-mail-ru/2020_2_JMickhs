import Network from '@network/network';
import Events from '@eventBus/eventbus';
import {
    HAVE_USER,
    REDIRECT_ERROR,
    HAVNT_USER,
} from '@eventBus/constants';

/** Информация о пользователе,
 *  Синглтон, чтобы проще шарить в разные части проекта
 */
class User {

    isAuth: boolean;
    id: number;
    username: string;
    email: string;
    avatar: string;

    constructor() {
        this.isAuth = false;
        this.id = -1;
        this.username = '';
        this.avatar = '';
    }

    getData() {
        return {
            username: this.username,
            email: this.email,
            id: this.id,
            avatar: this.avatar,
            isAuth: this.isAuth
        };
    }

    getFromCookie(): void {
        const response = Network.user();
        response.then((response) => {
            const code = response.code;
            const data = response.data;
            switch (code) {
            case 200:
                this.isAuth = true;
                this.username = data.username;
                this.id = data.id;
                this.avatar = Network.getUrlFile(data.avatar);
                this.email = data.email;
                Events.trigger(HAVE_USER, this.getData());
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
}

export default new User();

import User from '@user/user';

export default class NavModel {
    private user: User;

    constructor() {
        this.user = User.getInstance();
    }

    getData(): {isAuth: boolean, username: string, renderButtons: boolean} {
        return {
            isAuth: this.user.isAuth,
            username: this.user.userName,
            renderButtons: !this.user.waiting(),
        };
    }
}

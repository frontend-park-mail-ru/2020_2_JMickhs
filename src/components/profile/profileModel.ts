import User from '@user/user';
import { UserData } from '@interfaces/structsData/userData';

export default class ProfileModel {
    private user: User;

    constructor() {
        this.user = User.getInstance();
    }

    isAuth(): boolean {
        return this.user.isAuth;
    }

    getData(): UserData {
        return this.user.getData();
    }
}

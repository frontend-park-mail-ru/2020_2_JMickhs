import User from '@user/user';
import { UserData } from '@/helpers/interfaces/structsData/user-data';

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

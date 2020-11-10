import User from '@user/user';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';

export default class ProfileModel {
    private user: typeof User;

    constructor() {
        this.user = User;
    }

    isWaiting(): boolean {
        return this.user.waiting();
    }

    isAuth(): boolean {
        return this.user.isAuth;
    }

    getData(): UserData {
        return this.user.getData();
    }
}

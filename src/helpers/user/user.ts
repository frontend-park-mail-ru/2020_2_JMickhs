import type { UserData } from '@/helpers/interfaces/structs-data/user-data';

class User {
    private isWaiting: boolean;

    isAuth: boolean;

    id: number;

    userName: string;

    email: string;

    avatar: string;

    isModerator: boolean;

    constructor() {
        this.isAuth = false;
        this.id = -1;
        this.userName = '';
        this.avatar = '';
        this.email = '';
        this.isModerator = false;
    }

    waiting(): boolean {
        return this.isWaiting;
    }

    updateWaiting(waiting: boolean): void {
        this.isWaiting = waiting;
    }

    getData(): UserData {
        return {
            username: this.userName,
            email: this.email,
            id: this.id,
            avatar: this.avatar,
            isAuth: this.isAuth,
            mode_rule: this.isModerator,
        };
    }

    setData(user: UserData): void {
        this.isAuth = true;
        this.userName = user.username;
        this.email = user.email;
        this.id = user.id;
        this.avatar = user.avatar;
        this.isModerator = user.mode_rule;
    }

    clear(): void {
        this.isAuth = false;
        this.id = -1;
        this.userName = '';
        this.avatar = '';
        this.email = '';
        this.isModerator = false;
    }
}

export default new User();

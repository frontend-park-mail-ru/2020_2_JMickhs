import { UserData } from '@/helpers/interfaces/structs-data/user-data';

export default class User {
    isAuth: boolean;

    id: number;

    userName: string;

    email: string;

    avatar: string;

    private static instance: User;

    static getInstance(): User {
        if (this.instance === undefined) {
            this.instance = new User();
        }
        return this.instance;
    }

    private constructor() {
        this.isAuth = false;
        this.id = -1;
        this.userName = '';
        this.avatar = '';
        this.email = '';
    }

    getData(): UserData {
        return {
            username: this.userName,
            email: this.email,
            id: this.id,
            avatar: this.avatar,
            isAuth: this.isAuth,
        };
    }

    setData(user: UserData): void {
        this.isAuth = true;
        this.userName = user.username;
        this.email = user.email;
        this.id = user.id;
        this.avatar = user.avatar;
    }

    clear(): void {
        this.isAuth = false;
        this.id = -1;
        this.userName = '';
        this.avatar = '';
        this.email = '';
    }
}

import {UserData} from '@interfaces/structsData/userData';

export default class User {

    isAuth: boolean;
    id: number;
    username: string;
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
        this.username = '';
        this.avatar = '';
    }

    getData(): UserData {
        return {
            username: this.username,
            email: this.email,
            id: this.id,
            avatar: this.avatar,
            isAuth: this.isAuth
        };
    }

    setData(user: UserData): void {
        this.isAuth = user.isAuth;
        this.username = user.username;
        this.email = user.email;
        this.id = user.id;
        this.avatar = user.avatar;
    }
}

export default class HomeModel {

    private username: string;
    private isAuth: boolean;

    constructor() {
        this.isAuth = false;
    }

    getData(): {isAuth: boolean, username: string} {
        return {
            isAuth: this.isAuth,
            username: this.username
        };
    }

    setData(name: string): void {
        this.isAuth = !(name === '');
        this.username = name;
    }
}

export default class NavModel {
    private username: string;

    private isAuth: boolean;

    constructor() {
        this.isAuth = false;
        this.username = '';
    }

    getData(): {isAuth: boolean, username: string} {
        return {
            isAuth: this.isAuth,
            username: this.username,
        };
    }

    setData(name: string): void {
        this.isAuth = !(name === '');
        this.username = name;
    }
}

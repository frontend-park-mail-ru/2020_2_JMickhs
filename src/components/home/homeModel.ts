import NetworkHostel from '@network/networkHostel';
import { ResponseData } from '@network/structsServer/resposeData';

export default class HomeModel {
    private userName: string;

    private isAuth: boolean;

    constructor() {
        this.isAuth = false;
        this.userName = 'Александр Цветков';
    }

    getData(): {isAuth: boolean, username: string} {
        return {
            isAuth: this.isAuth,
            username: this.userName,
        };
    }

    setData(name: string): void {
        this.isAuth = !(name === '');
        this.userName = name;
    }

    search(pattern: string, page?: number): Promise<ResponseData> {
        return NetworkHostel.searchHostel(pattern, page);
    }
}

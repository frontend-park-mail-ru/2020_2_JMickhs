import NetworkHostel from "@network/networkHostel";
import {ResponseData} from "@interfaces/structsData/resposeData";

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

    search(pattern: string, page?: number): Promise<ResponseData> {
        return NetworkHostel.searchHostel(pattern, page);
    }
}

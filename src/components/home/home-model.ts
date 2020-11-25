import NetworkHostel from '@/helpers/network/network-hostel';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import Events from '@eventbus/eventbus';
import { FILL_HOSTELS } from '@eventbus/constants';
import Redirector from '@router/redirector';

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

    search(searchParams: string): void {
        const response = NetworkHostel.searchHostel(searchParams);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {hotels: HostelData[], Pag_info: unknown};
                    Events.trigger(FILL_HOSTELS, data.hotels);
                    break;
                case 400:
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }
}

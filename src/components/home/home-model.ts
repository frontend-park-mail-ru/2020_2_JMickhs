import NetworkHostel from '@/helpers/network/network-hostel';
import type {
    Coordinate,
    HostelData,
} from '@/helpers/interfaces/structs-data/hostel-data';
import Events from '@eventbus/eventbus';
import {
    FILL_COORDINATE,
    FILL_HOSTELS,
    FILL_RECOMMENDATION,
} from '@eventbus/constants';
import Redirector from '@router/redirector';
import { ERROR_400, ERROR_DEFAULT } from '@/helpers/global-variables/network-error';

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
                    const data = value.data as {hotels: HostelData[], Pag_info: unknown, point: Coordinate};
                    Events.trigger(FILL_HOSTELS, data.hotels);
                    Events.trigger(FILL_COORDINATE, data.point);
                    break;
                case 400:
                    Redirector.redirectError(ERROR_400);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }

    getRecommendation(): void {
        const response = NetworkHostel.getRecommendedHostels();

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as { hotels: HostelData[] };
                    Events.trigger(FILL_RECOMMENDATION, data.hotels);
                    Events.trigger(FILL_COORDINATE, {});
                    break;
                case 400:
                    Redirector.redirectError(ERROR_400);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }
}

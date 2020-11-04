import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    LOAD_HOSTELS,
} from '@eventBus/constants';
import { HostelData } from '@interfaces/structsData/hostelData';
import { ResponseData } from '@/helpers/network/structsServer/resposeData';
import Redirector from '@/helpers/router/redirector';

export default class ListModel {
    public hostels: HostelData[];

    constructor() {
        this.hostels = [];
    }

    fillModel(promiseData?: Promise<ResponseData>): void {
        let response: Promise<ResponseData>;
        if (promiseData === undefined) {
            response = NetworkHostel.getHostels();
        } else {
            response = promiseData;
        }
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {hotels: HostelData[], Pag_info: unknown};
                    this.hostels = data.hotels;
                    Events.trigger(LOAD_HOSTELS, this.getData());
                    break;
                case 400:
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера - ${code}`);
                    break;
            }
        });
    }

    getData(): unknown {
        return this.hostels;
    }
}

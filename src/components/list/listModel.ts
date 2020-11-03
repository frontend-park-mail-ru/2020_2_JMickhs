import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    LOAD_HOSTELS,
    REDIRECT_ERROR,
} from '@eventBus/constants';
import { HostelData } from '@interfaces/structsData/hostelData';
import { ResponseData } from '@/helpers/network/structsServer/resposeData';

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
            const data = value.data as {hotels: HostelData[], Pag_info: unknown};
            switch (code) {
                case 200:
                    this.hostels = data.hotels;
                    Events.trigger(LOAD_HOSTELS, this.getData());
                    break;
                case 400:
                    Events.trigger(REDIRECT_ERROR, { url: '/error', err: 'Неверный формат запроса' });
                    break;
                default:
                    Events.trigger(REDIRECT_ERROR, {
                        url: '/error',
                        err: 'Что-то страшное произошло c нишим сервером...'
                        + ` Он говорит: ${code}`,
                    });
                    break;
            }
        });
    }

    getData(): unknown {
        return this.hostels;
    }
}

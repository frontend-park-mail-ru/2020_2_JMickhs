import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    LOAD_HOSTELS,
    REDIRECT_ERROR,
} from '@eventBus/constants';

export default class ListModel {
    public hostels: unknown; // на самом деле, это массив объектов

    constructor() {
        this.hostels = [];
    }

    fillModel(): void {
        const response = NetworkHostel.getHostels();
        response.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                this.hostels = response.data;
                Events.trigger(LOAD_HOSTELS, this.getData());
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Что-то страшное произошло c нишим сервером...' +
                        ` Он говорит: ${code}`});
                break;
            }
        });
    }

    getData(): unknown {
        return this.hostels;
    }
}

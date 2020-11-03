import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    LOAD_HOSTELS,
    REDIRECT_ERROR,
} from '@eventBus/constants';

/** Класс модели для страницы списка отелей */
export default class ListModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this.hostels = [];
    }
    /**
     * Получить список отелей с сервера
     */
    fillModel() {
        const response = NetworkHostel.getHostels();
        response.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                this.hostels = response.data.hotels;
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
    /**
     * Получить список отелей с сервера
     * @return {Object}
     */
    getData() {
        return this.hostels;
    }
}

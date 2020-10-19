import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';
import {
    LOAD_HOSTELS,
    REDIRECT_ERROR,
} from '../../helpers/eventbus/constants';

/** Класс модели для страницы списка отелей */
export default class ListModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this.haveInfo = false;
        this.hostels = [];
    }
    /**
     * Получить список отелей с сервера
     */
    getInfo() {
        const response = Net.getHostels();
        response.then((response) => {
            const data = response.data;
            const code = response.code;
            switch (code) {
            case 200:
                this.haveInfo = true;
                this.hostels = data;
                this.hostels.forEach((hostel) => {
                    hostel.image = Net.getUrlFile(hostel.image);
                });
                Events.trigger(LOAD_HOSTELS);
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Что-то страшное произошло c нишим сервером...' +
                        ` Он говорит: ${status}`});
                break;
            }
        });
    }
}

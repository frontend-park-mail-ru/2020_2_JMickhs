import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERROR_HOSTEL,
    UPDATE_HOSTEL,
} from '../../helpers/eventbus/constants';

/** Класс модели для страницы отеля */
export default class HostelModel {
    /**
     * Инициализация класса
     */
    constructor() {
        this.id = -1;
        this.description = '';
        this.image = '';
        this.name = '';
    }
    /**
     * Получить список отелей с сервера
     * @param {int} id - id отеля
     */
    fillModel(id) {
        const response = Net.getHostel(id);
        response.then((response) => {
            const data = response.data;
            const code = response.code;
            switch (code) {
            case 200:
                this.description = data.description;
                this.id = data.hotel_id;
                this.name = data.name;
                this.image = Net.getUrlFile(data.image);
                this.location = data.location;
                Events.trigger(UPDATE_HOSTEL);
                break;
            case 400:
                Events.trigger(ERROR_HOSTEL); // TODO: нет подписки
                break;
            case 410:
                Events.trigger(ERROR_HOSTEL);
                break;
            default:
                Events.trigger(ERROR_HOSTEL);
                break;
            }
        });
    }
}

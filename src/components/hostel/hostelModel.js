import Net from '@network/network';
import Events from '@eventBus/eventbus';
import {
    REDIRECT_ERROR,
    UPDATE_HOSTEL,
} from '@eventBus/constants';

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
            const data = response.data.hotel;
            const code = response.code;
            switch (code) {
            case 200:
                this.description = data.description;
                this.id = data.hotel_id;
                this.name = data.name;
                this.image = Net.getUrlFile(data.image);
                this.location = data.location;
                Events.trigger(UPDATE_HOSTEL, this.getData());
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
                break;
            case 410:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Такого отеля не существует'});
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Что-то страшное произошло c нишим сервером...' +
                        ` Он говорит: ${status}`});
                break;
            }
        });
    }
    /**
     * Получить список отелей с сервера
     * @return {Object}
     */
    getData() {
        const data = {
            id: this.id,
            name: this.name,
            description: this.description,
            location: this.location,
            image: this.image,
        };
        return data;
    }
}

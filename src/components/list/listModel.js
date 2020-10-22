import Net from '@network/network';
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
        const response = Net.getHostels();
        response.then((response) => {
            const data = response.data;
            const code = response.code;
            switch (code) {
            case 200:
                this.hostels = data;
                this.loadHotels();
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
    /**
     * Функция поиска отелей
     * @param {string} pattern - паттерн поиска
     */
    search(pattern) {
        const response = Net.searchHotels(pattern);
        response.then((response) => {
            const data = response.data;
            const code = response.code;
            switch (code) {
            case 200:
                this.hostels = data.hotels;
                this.loadHotels();
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
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
    /**
     * Запрашивает у сервера все аватарки и триггерит рендер отелей
     */
    loadHotels() {
        this.hostels.forEach((hostel) => {
            hostel.image = Net.getUrlFile(hostel.image);
        });
        Events.trigger(LOAD_HOSTELS, this.getData());
    }
}

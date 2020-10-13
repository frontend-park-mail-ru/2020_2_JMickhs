import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';
import {
    ERR_LOAD_HOSTELS,
    LOAD_HOSTELS,
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
                Events.trigger(LOAD_HOSTELS);
                break;
            case 400:
                Events.trigger(ERR_LOAD_HOSTELS); // TODO: dont subscribe
                break;
            default:
                Events.trigger(ERR_LOAD_HOSTELS); // TODO: dont subscribe
                break;
            }
        });
    }
}

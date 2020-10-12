import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';
import {LOAD_HOSTELS} from '../../helpers/eventbus-const/constants';

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
            const err = response.error;
            const data = response.data;
            const status = response.status;
            if (status === 200 && err === undefined) {
                this.haveInfo = true;
                this.hostels = data;
                Events.trigger(LOAD_HOSTELS);
            }
        });
    }
}

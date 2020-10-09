import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';

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
            const err = response.error;
            const data = response.data;
            const status = response.status;
            if (status !== 200 || err !== undefined) {
                Events.trigger('errorHostel');
                return;
            }
            this.description = data.description;
            this.id = data.id;
            this.name = data.name;
            this.image = data.image;
            Events.trigger('updateHostel');
        });
    }
}

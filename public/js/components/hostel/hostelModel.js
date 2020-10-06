import Net from '../../helpers/network/network';

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
        response.then(response => {
            if (response.status !== 200) {
                EventBus.trigger('errorHostel');
                return;
            }
            const body = response.body;
            this.description = body.description;
            this.id = body.id;
            this.name = body.name;
            this.image = body.image;
            EventBus.trigger('updateHostel');
        });
    }
}
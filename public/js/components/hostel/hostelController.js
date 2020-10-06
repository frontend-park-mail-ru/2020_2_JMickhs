import HostelModel from './hostelModel';
import HostelView from './hostelView';
import Events from './../../helpers/eventbus/eventbus';

/** Класс контроллера для страницы списка отеля */
export default class HotelController {
    /**
     * Инициализация класса
     * @param {*} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new HostelModel();
        this._view = new HostelView(parent, this._model);
    }
    /**
     * Заполнение данных модели с сервера
     * @param {int} id - id отеля
     */
    activate(id) {
        if (id === undefined || !Number.isInteger(+id)) {
            Events.trigger('redirect', {url: '/error'});
            return;
        }
        this._model.fillModel(id);
    }
}

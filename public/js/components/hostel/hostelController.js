import HostelModel from './hostelModel';
import HostelView from './hostelView';
import Events from './../../helpers/eventbus/eventbus';
import {
    NAVBAR_ACTIVE,
    REDIRECT,
} from '../../helpers/eventbus-const/constants';

/** Класс контроллера для страницы списка отеля */
export default class HotelController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new HostelModel();
        this._view = new HostelView(parent, this._model);
    }
    /**
     * Активация работы контроллера для отеля с id
     * @param {number} id - id отеля
     */
    activate(id) {
        Events.trigger(NAVBAR_ACTIVE, 2);
        if (id === undefined || !Number.isInteger(+id)) {
            Events.trigger(REDIRECT, {url: '/error'});
            return;
        }
        this._model.fillModel(id);
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        // TODO:
    }
}

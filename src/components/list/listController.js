import ListModel from './listModel';
import ListView from './listView';
import Events from '../../helpers/eventbus/eventbus';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus/constants';

/** Класс контроллера для страницы списка отелей */
export default class ListController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new ListModel();
        this._view = new ListView(parent);
        this.haveInfo = false;
    }
    /**
     * Сетер для данных модели
     * @param {Object} arg - оъект с данными
     */
    set data(arg) {
        const {hotels} = arg;
        this.haveInfo = true;
        this._model.hostels = hotels;
    }
    /**
     * Заполнение данных модели с сервера
     * @param {string} arg
     */
    activate(arg) {
        Events.trigger(NAVBAR_ACTIVE, 2);
        this._view.subscribeEvents();
        if (!this.haveInfo && arg) {
            this._model.search(arg);
        }
        if (!this.haveInfo && !arg) {
            this._model.fillModel();
        }
        if (this.haveInfo) {
            this._model.loadHotels();
        }
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.hide();
        this._view.unsubscribeEvents();
        this.haveInfo = false;
    }
}

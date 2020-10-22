import ListModel from '@list/listModel';
import ListView from '@list/listView';
import Events from '@eventBus/eventbus';
import {NAVBAR_ACTIVE} from '@eventBus/constants';

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
     * Заполнение данных модели с сервера
     * @param {string} arg
     */
    activate(arg) {
        const {state} = history.state || {state: undefined};
        if (state !== {} && state !== undefined) {
            this.haveInfo = true;
            this._model.hostels = state;
        }
        Events.trigger(NAVBAR_ACTIVE, 2);
        this._view.subscribeEvents();
        if (!this.haveInfo && arg) {
            this._model.search(arg);
        }
        if (!this.haveInfo && arg === undefined) {
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

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
        this._view = new ListView(parent, this._model);
    }
    /**
     * Заполнение данных модели с сервера
     */
    activate() {
        Events.trigger(NAVBAR_ACTIVE, 2);
        this._model.fillModel();
        this._view.subscribeEvents();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.hide();
        this._view.unsubscribeEvents();
    }
}

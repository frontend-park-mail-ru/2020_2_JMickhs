import ListModel from './listModel';
import ListView from './listView';
import Events from '../../helpers/eventbus/eventbus';

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
        Events.trigger('navbarActive', 2);
        this._model.getInfo();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        // TODO:
    }
}

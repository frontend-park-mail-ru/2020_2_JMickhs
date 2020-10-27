import ListModel from '@list/listModel';
import ListView from '@list/listView';

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
     * Заполнение данных модели с сервераы
     */
    activate() {
        this._view.subscribeEvents();
        if (!this.haveInfo) {
            this._model.fillModel();
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

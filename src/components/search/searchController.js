import Events from '../../helpers/eventbus/eventbus';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus/constants';
import SearchView from './searchView';
import SearchModel from './searchModel';

/** Класс контроллера для страницы вырвиглазного поиска */
export default class SearchController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._view = new SearchView(parent);
        this._model = new SearchModel();
    }
    /**
     * Заполнение данных модели с сервера
     */
    activate() {
        Events.trigger(NAVBAR_ACTIVE, 1);
        this._view.render();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.hide();
    }
}

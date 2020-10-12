import Events from '../../helpers/eventbus/eventbus';
import HomeView from './homeView';
import {NAVBAR_ACTIVE} from '../../helpers/eventbus-const/constants';

/** Класс контроллера для домашней страницы */
export default class HomeController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._view = new HomeView(parent);
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        Events.trigger(NAVBAR_ACTIVE, 1);
        this._view.render();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        // TODO:
    }
}

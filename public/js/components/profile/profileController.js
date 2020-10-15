import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from './../../helpers/eventbus/eventbus';
import {
    NAVBAR_ACTIVE,
} from '../../helpers/eventbus/constants';

/** Класс контроллера для страницы профиля */
export default class ProfileController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = ProfileModel;
        this._view = new ProfileView(parent, this._model);
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.subscribeEvents();
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth) {
            this._view.render();
        }
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.hide();
        this._view.unsubscribeEvents();
    }
}

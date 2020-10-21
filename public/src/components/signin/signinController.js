import SigninModel from './signinModel';
import SigninView from './signinView';
import Events from './../../helpers/eventbus/eventbus';
import {
    REDIRECT,
    NAVBAR_ACTIVE,
    PAGE_SIGNIN,
} from '../../helpers/eventbus/constants';

/** Класс контроллера для страницы авторизации */
export default class SigninController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent, this._model);
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.subscribeEvents();
        Events.trigger(PAGE_SIGNIN);
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth()) {
            Events.trigger(REDIRECT, {url: '/profile'});
            return;
        }
        this._view.render();
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.unsubscribeEvents();
        this._view.hide();
    }
}

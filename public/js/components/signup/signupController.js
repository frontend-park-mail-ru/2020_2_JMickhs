import SignupModel from './signupModel';
import SignupView from './signupView';
import Events from '../../helpers/eventbus/eventbus';
import {
    NAVBAR_ACTIVE,
    PAGE_SIGNUP,
    REDIRECT,
} from '../../helpers/eventbus/constants';

/** Класс контроллера для страницы регистрации */
export default class SignupController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = new SignupModel();
        this._view = new SignupView(parent, this._model);
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.subscribeEvents();
        Events.trigger(PAGE_SIGNUP);
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

import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from './../../helpers/eventbus/eventbus';
import {
    CHANGE_USER,
    NAVBAR_ACTIVE,
    ERROR_CHANGE_LOGIN,
    ERROR_CHANGE_EMAIL,
} from '../../helpers/eventbus/constants';
import Validation from '../../helpers/validation/validation';

/** Класс контроллера для страницы профиля */
export default class ProfileController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = ProfileModel;
        this._view = new ProfileView(parent, this._model);

        this._handlers = {
            changeUser: (arg) => {
                const {username, email} = arg;
                if (username === this._model.login && email === this._model.email) {
                    this._view.renderMsgDataSettings('Вы ничего не изменили =)');
                    return;
                }
                const key1 = Validation.validateLogin(username, ERROR_CHANGE_LOGIN);
                const key2 = Validation.validateEmail(email, ERROR_CHANGE_EMAIL);
                if (!key1 || !key2) {
                    return;
                }
                this._model.fixUser(username, email);
            },
            errorLogin: (text) => {
                this._view.renderMsgDataSettings(text);
                this._view.renderLoginInputError();
            },
            errorEmail: (text) => {
                this._view.renderMsgDataSettings(text);
                this._view.renderEmailInputError();
            },
        };
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this._view.subscribeEvents();
        Events.trigger(NAVBAR_ACTIVE, 3);
        if (this._model.isAuth) {
            this._view.render();
            this.subscribeEvents();
        }
    }
    /**
     * Отключение работы контроллера и чистка памяти
     */
    deactivate() {
        this._view.hide();
        this._view.unsubscribeEvents();
        this.unsubscribeEvents();
    }
    /**
     * Подписка на события
     */
    subscribeEvents() {
        Events.subscribe(CHANGE_USER, this._handlers.changeUser);
        Events.subscribe(ERROR_CHANGE_LOGIN, this._handlers.errorLogin);
        Events.subscribe(ERROR_CHANGE_EMAIL, this._handlers.errorEmail);
    }
    /**
     *  Отписка от событий
     */
    unsubscribeEvents() {
        if (!this._model.isAuth) {
            return;
        }
        Events.unsubscribe(CHANGE_USER, this._handlers.changeUser);
        Events.unsubscribe(ERROR_CHANGE_LOGIN, this._handlers.errorLogin);
        Events.unsubscribe(ERROR_CHANGE_EMAIL, this._handlers.errorEmail);
    }
}

import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from './../../helpers/eventbus/eventbus';
import {
    CHANGE_USER,
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

        this._handlers = {
            changeUser: (arg) => {
                const {username, email} = arg;
                if (username === this._model.login && email === this._model.email) {
                    this._view.renderErrDataSettings('Вы ничего не изменили =)');
                    return;
                }
                this._model.fixUser(username, email);
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
    }
    /**
     *  Отписка от событий
     */
    unsubscribeEvents() {
        if (!this._model.isAuth) {
            return;
        }
        Events.unsubscribe(CHANGE_USER, this._handlers.changeUser);
    }
}

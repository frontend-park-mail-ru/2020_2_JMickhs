import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from './../../helpers/eventbus/eventbus';
import {
    CHANGE_USER,
    NAVBAR_ACTIVE,
    ERROR_CHANGE_LOGIN,
    ERROR_CHANGE_EMAIL,
    UPDATE_PASSWORD,
    PASSWORD_VALIDATE_ERROR, PASSWORD_UPDATE_ERROR,
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

        this._makeHandlers();
    }
    /**
     * Активация работы контроллера
     */
    activate() {
        this.subscribeEvents();
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
        this.unsubscribeEvents();
        this._view.unsubscribeEvents();
        this._view.hide();
    }
    /**
     * Подписка на события
     */
    subscribeEvents() {
        Events.subscribe(CHANGE_USER, this._handlers.changeUser);
        Events.subscribe(ERROR_CHANGE_LOGIN, this._handlers.errorLogin);
        Events.subscribe(ERROR_CHANGE_EMAIL, this._handlers.errorEmail);
        Events.subscribe(UPDATE_PASSWORD, this._handlers.updatePsw);
        Events.subscribe(PASSWORD_VALIDATE_ERROR, this._handlers.pswValidateErr);
    }
    /**
     *  Отписка от событий
     */
    unsubscribeEvents() {
        Events.unsubscribe(CHANGE_USER, this._handlers.changeUser);
        Events.unsubscribe(ERROR_CHANGE_LOGIN, this._handlers.errorLogin);
        Events.unsubscribe(ERROR_CHANGE_EMAIL, this._handlers.errorEmail);
        Events.unsubscribe(UPDATE_PASSWORD, this._handlers.updatePsw);
        Events.unsubscribe(PASSWORD_VALIDATE_ERROR, this._handlers.pswValidateErr);
    }
    /**
     * Функция создает и заполняет поле _handlers обработчиками событий
     */
    _makeHandlers() {
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
                this._model.changeUser(username, email);
            },
            errorLogin: (text) => {
                this._view.renderMsgDataSettings(text);
                this._view.renderLoginInputError();
            },
            errorEmail: (text) => {
                this._view.renderMsgDataSettings(text);
                this._view.renderEmailInputError();
            },
            updatePsw: (arg) => {
                const oldPsw = arg.oldPassword;
                const newPsw1 = arg.newPassword1;
                const newPsw2 = arg.newPassword2;
                if (newPsw1 !== newPsw2) {
                    this._view.renderNewPswInputError();
                    this._view.renderMsgPswSettings('Пароли не совпадают');
                    return;
                }
                if (oldPsw === newPsw1) {
                    this._view.renderNewPswInputError();
                    this._view.renderOldPswInputError();
                    this._view.renderMsgPswSettings('Старый и новый пароль совпадает');
                    return;
                }
                const ok = Validation.validatePassword(oldPsw, PASSWORD_UPDATE_ERROR);
                const key = Validation.validatePassword(newPsw1, PASSWORD_VALIDATE_ERROR);
                if (!key || !ok) {
                    return;
                }
                this._model.updatePassword(oldPsw, newPsw2);
            },
            pswValidateErr: (text) => {
                this._view.renderNewPswInputError();
                this._view.renderMsgPswSettings(text);
            },
        };
    }
}

import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from '../../helpers/eventbus/eventbus';
import {
    CHANGE_USER,
    NAVBAR_ACTIVE,
    UPDATE_PASSWORD,
} from '../../helpers/eventbus/constants';
import Validator from '../../helpers/validator/validator';

/** Класс контроллера для страницы профиля */
export default class ProfileController {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        this._model = ProfileModel;
        this._view = new ProfileView(parent, this._model);

        this._handlers = this._makeHandlers();
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
        Events.subscribe(UPDATE_PASSWORD, this._handlers.updatePsw);
    }
    /**
     *  Отписка от событий
     */
    unsubscribeEvents() {
        Events.unsubscribe(CHANGE_USER, this._handlers.changeUser);
        Events.unsubscribe(UPDATE_PASSWORD, this._handlers.updatePsw);
    }
    /**
     * Проверка данных, переданных для изменения
     * @param {Object} arg - {login: string, email: string}
     */
    _validateDataChange(arg) {
        const {username, email} = arg;
        if (username === this._model.login && email === this._model.email) {
            this._view.renderMsgDataSettings('Вы ничего не изменили =)');
            return;
        }

        if (username === '') {
            this._view.renderMsgDataSettings('Заполните поле логина');
            this._view.renderLoginInputError();
            return;
        }

        if (email === '') {
            this._view.renderMsgDataSettings('Заполните поле c почтой');
            this._view.renderEmailInputError();
            return;
        }

        const loginErrors = Validator.validateLogin(username);
        if (loginErrors.length > 0) {
            this._view.renderMsgDataSettings(loginErrors[0]);
            this._view.renderLoginInputError();
            return;
        }

        const emailErrors = Validator.validateEmail(email);
        if (emailErrors.length > 0) {
            this._view.renderMsgDataSettings(emailErrors[0]);
            this._view.renderEmailInputError();
            return;
        }

        this._model.changeUser(username, email);
    }
    /**
     * Проверка изменения пароля
     * @param {Object} arg
     */
    _validatePswChange(arg) {
        const oldPsw = arg.oldPassword;
        const newPsw1 = arg.newPassword1;
        const newPsw2 = arg.newPassword2;
        if (oldPsw === '') {
            this._view.renderOldPswInputError();
            this._view.renderMsgPswSettings('Необходимо заполнить все поля');
            return;
        }
        if (newPsw1 === '') {
            this._view.renderNewPswInputError();
            this._view.renderMsgPswSettings('Необходимо заполнить все поля');
            return;
        }
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

        const pswErrors = Validator.validatePassword(newPsw1);
        if (pswErrors.length > 0) {
            this._view.renderNewPswInputError();
            this._view.renderMsgPswSettings(pswErrors[0]);
            return;
        }

        this._model.updatePassword(oldPsw, newPsw2);
    }
    /**
     * Функция создает обработчики событий
     * @return {Object} - возвращает обьект с обработчиками
     */
    _makeHandlers() {
        const handlers = {
            changeUser: this._validateDataChange.bind(this),
            updatePsw: this._validatePswChange.bind(this),
        };
        return handlers;
    }
}

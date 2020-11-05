import {PageView} from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {
    UPDATE_PASSWORD,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    AUTH_USER,
    NOT_AUTH_USER,
    CHANGE_USER_OK,
} from '@eventBus/constants';

import profileTemplate from '@profile/templates/profilePage.hbs';
import Redirector from '@router/redirector';
import DataUserComponent from '@profile/components/profileData';
import SettingsDataComponent from '@profile/components/settingsData';

/** Класс представления для страницы профиля */
export default class ProfileView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        super(parent);

        this._pswTimerId = -1;

        this._handlers = this._makeHandlers();
    }

    /**
     * Подписка на события страницы профиля
     */
    subscribeEvents() {
        Events.subscribe(AUTH_USER, this._handlers.render);
        Events.subscribe(NOT_AUTH_USER, this._handlers.redirectSignin);
        Events.subscribe(GET_NEW_PASSWORD, this._handlers.getNewPsw);
        Events.subscribe(PASSWORD_UPDATE_ERROR, this._handlers.pswUpdateError);
        Events.subscribe(CHANGE_USER_OK, this._handlers.okChangeUser);
    }

    /**
     * Отписка от событий страницы профиля
     */
    unsubscribeEvents() {
        Events.unsubscribe(GET_NEW_PASSWORD, this._handlers.getNewPsw);
        Events.unsubscribe(PASSWORD_UPDATE_ERROR, this._handlers.pswUpdateError);
        Events.unsubscribe(AUTH_USER, this._handlers.render);
        Events.unsubscribe(NOT_AUTH_USER, this._handlers.redirectSignin);
        Events.unsubscribe(CHANGE_USER_OK, this._handlers.okChangeUser);
    }

    /**
     * Функция создает обработчики событий
     * @return {Object} - возвращает обьект с обработчиками
     */
    _makeHandlers() {
        const handlers = {
            render: this.render.bind(this),
            getNewPsw: () => {
                this.renderMsgPswSettings('Вы успешно поменяли пароль', false);
                document.getElementById('old-psw').value = '';
                document.getElementById('new-psw1').value = '';
                document.getElementById('new-psw2').value = '';
            },
            pswUpdateError: (arg) => {
                this.renderOldPswInputError();
                this.renderMsgPswSettings(arg);
            },
            errUpdateAvatar: (arg) => {
                this.renderMessageAvatar(arg, true);
            },
            redirectSignin: () => {
                Redirector.redirectTo('/signin');
            },
            updatePswClick: (evt) => {
                evt.preventDefault();
                const oldPsw = document.getElementById('old-psw').value;
                const newPsw1 = document.getElementById('new-psw1').value;
                const newPsw2 = document.getElementById('new-psw2').value;
                Events.trigger(UPDATE_PASSWORD, {
                    oldPassword: oldPsw,
                    newPassword1: newPsw1,
                    newPassword2: newPsw2,
                });
            },
            okChangeUser: (user) => {
                this.dataComponent.updateData(user.username, user.email);
                this.renderMsgDataSettings('Изменения применены!', false);
            },
        };
        return handlers;
    }

    /**
     * Отрисовка страницы профиля
     * @param {Object} data - данные, по которым рисуется вьюшка
     */
    render(data) {
        window.scrollTo(0, 0);
        this.page.innerHTML = profileTemplate(data);

        const dataPlace = document.getElementById('profile-data');
        this.dataComponent = new DataUserComponent(dataPlace);
        const settingsDataPlace = document.getElementById('settings-data');
        this.settingsDataComponent = new SettingsDataComponent(settingsDataPlace);

        this.dataComponent.activate(data);
        this.settingsDataComponent.activate();

        const btnSavePsw = document.getElementById('btn-save-sequr');
        btnSavePsw.addEventListener('click', this._handlers.updatePswClick);

        this.subscribeEvents();
    }

    /**
     * Выделение инпута старого пароля
     */
    renderOldPswInputError() {
        const input = document.getElementById('old-psw');
        input.className += ' profile__input--error';
        setTimeout(() => {
            if (input) {
                input.className = 'profile__input';
            }
        }, 5000);
    }

    /**
     * Выделение инпута новых пароля
     */
    renderNewPswInputError() {
        const input1 = document.getElementById('new-psw1');
        const input2 = document.getElementById('new-psw2');
        input1.className += ' profile__input--error';
        input2.className += ' profile__input--error';
        setTimeout(() => {
            if (input1 && input2) {
                input1.className = 'profile__input';
                input2.className = 'profile__input';
            }
        }, 5000);
    }

    /**
     * Отрисовка уведомления об изменении пароля
     * @param {string} [text=''] - текст уведомления
     * @param {boolean} [isErr=true] - тип уведомления(false - ошибка)
     */
    renderMsgPswSettings(text = '', isErr = true) {
        if (this._pswTimerId !== -1) {
            clearTimeout(this._pswTimerId);
        }
        const errLine = document.getElementById('text-error-sequr');

        if (isErr) {
            errLine.className += ' profile__text--red';
        } else {
            errLine.className += ' profile__text--blue';
        }

        errLine.textContent = text;

        this._pswTimerId = setTimeout(() => {
            if (errLine) {
                errLine.textContent = '';
                errLine.className = 'profile__text profile__text--center';
            }
            this._pswTimerId = -1;
        }, 5000);
    }

    /**
     * Скрытие страницы профиля
     */
    hide() {
        if (this.page.innerHTML === '') {
            return;
        }

        this.unsubscribeEvents();

        const btnSavePsw = document.getElementById('btn-save-sequr');
        btnSavePsw.removeEventListener('click', this._handlers.updatePswClick);

        this.dataComponent.deactivate();
        this.settingsDataComponent.deactivate();

        this.page.innerHTML = '';
    }
}

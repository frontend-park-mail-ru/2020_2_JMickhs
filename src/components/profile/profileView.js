import {PageView} from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {
    UPDATE_PASSWORD,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    UPDATE_AVATAR,
    ERR_UPDATE_AVATAR,
    SIGNOUT,
    REDIRECT,
    HAVE_USER,
    HAVNT_USER,
    CHANGE_USER,
    CHANGE_USER_OK,
    ERR_FIX_USER,
    SIGNOUT_CLICK,
    AVATAR_UPDATE_CLICK,
} from '@eventBus/constants';

import profileTemplate from '@profile/templates/profileTemplate.hbs';
import profileButtonTemplate from '@profile/templates/profileButtonTemplate.hbs';
import messageTemplate from '@profile/templates/profileMessage.hbs';

/** Класс представления для страницы профиля */
export default class ProfileView extends PageView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     */
    constructor(parent) {
        super(parent);

        this._avatarTimerId = -1;
        this._dataTimerId = -1;
        this._pswTimerId = -1;

        this._handlers = this._makeHandlers();
    }
    /**
     * Подписка на события страницы профиля
     */
    subscribeEvents() {
        Events.subscribe(HAVE_USER, this._handlers.render);
        Events.subscribe(HAVNT_USER, this._handlers.havntUser);
        Events.subscribe(ERR_UPDATE_AVATAR, this._handlers.errUpdateAvatar);
        Events.subscribe(GET_NEW_PASSWORD, this._handlers.getNewPsw);
        Events.subscribe(PASSWORD_UPDATE_ERROR, this._handlers.pswUpdateError);
        Events.subscribe(UPDATE_AVATAR, this._handlers.updateAvatar);
        Events.subscribe(SIGNOUT, this._handlers.havntUser);
        Events.subscribe(CHANGE_USER_OK, this._handlers.okChangeUser);
        Events.subscribe(ERR_FIX_USER, this._handlers.errFixUser);
    }
    /**
     * Отписка от событий страницы профиля
     */
    unsubscribeEvents() {
        Events.unsubscribe(GET_NEW_PASSWORD, this._handlers.getNewPsw);
        Events.unsubscribe(PASSWORD_UPDATE_ERROR, this._handlers.pswUpdateError);
        Events.unsubscribe(UPDATE_AVATAR, this._handlers.updateAvatar);
        Events.unsubscribe(SIGNOUT, this._handlers.havntUser);
        Events.unsubscribe(ERR_UPDATE_AVATAR, this._handlers.errUpdateAvatar);
        Events.unsubscribe(HAVE_USER, this._handlers.render);
        Events.unsubscribe(HAVNT_USER, this._handlers.havntUser);
        Events.unsubscribe(CHANGE_USER_OK, this._handlers.okChangeUser);
        Events.unsubscribe(ERR_FIX_USER, this._handlers.errFixUser);
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
            updateAvatar: (avatar) => {
                const img = document.getElementById('img-profile');
                img.src = avatar;
                this.renderMessageAvatar('Аватар успешно изменен');
            },
            errUpdateAvatar: (arg) => {
                this.renderMessageAvatar(arg, true);
            },
            havntUser: () => {
                Events.trigger(REDIRECT, {url: '/signin'});
            },
            updatePswClick: (evt) => {
                evt.preventDefault();
                const oldPsw = document.getElementById('old-psw').value;
                const newPsw1 = document.getElementById('new-psw1').value;
                const newPsw2 = document.getElementById('new-psw2').value;
                Events.trigger(UPDATE_PASSWORD,
                    {oldPassword: oldPsw, newPassword1: newPsw1, newPassword2: newPsw2});
            },
            inputAvatarFile: (evt) => {
                const inputFile = document.getElementById('profile-pic');
                const btnReload = document.getElementById('div-avatar-bottom');
                btnReload.innerHTML = profileButtonTemplate();
                const btn = document.getElementById('btn-reload');
                btn.addEventListener('click', this._handlers.updateAvatarClick);
                const file = evt.target.files[0];
                const reader = new FileReader();
                const img = document.getElementById('img-profile');
                img.title = file.name;
                reader.onload = function(event) {
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);
                inputFile.addEventListener('change', this._handlers.updateAvatarBtnRender);
            },
            updateAvatarClick: (evt) => {
                evt.preventDefault();
                const inputFile = document.getElementById('profile-pic');
                const btnReload = document.getElementById('div-avatar-bottom');
                const formAvatar = document.getElementById('avatar-form');
                const btn = document.getElementById('btn-reload');
                Events.trigger(AVATAR_UPDATE_CLICK, formAvatar);
                btn.removeEventListener('click', this._handlers.updateAvatarClick);
                btnReload.innerHTML = '';
                inputFile.value = '';
            },
            signoutClick: () => {
                Events.trigger(SIGNOUT_CLICK);
            },
            saveDataClick: (evt) => {
                evt.preventDefault();
                const username = document.getElementById('login-profile').value;
                const email = document.getElementById('email-profile').value;
                Events.trigger(CHANGE_USER, {username: username, email: email});
            },
            okChangeUser: (user) => {
                document.getElementById('label-login').textContent = user.username;
                document.getElementById('label-email').textContent = user.email;
                this.renderMsgDataSettings('Изменения применены!', false);
            },
            errFixUser: (text) => {
                this.renderMsgDataSettings(text);
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

        const inputFile = document.getElementById('profile-pic');
        inputFile.addEventListener('change', this._handlers.inputAvatarFile);

        const btnExit = document.getElementById('btn-exit');
        btnExit.addEventListener('click', this._handlers.signoutClick);

        const btnSaveData = document.getElementById('btn-save-data');
        btnSaveData.addEventListener('click', this._handlers.saveDataClick);


        const btnSavePsw = document.getElementById('btn-save-sequr');
        btnSavePsw.addEventListener('click', this._handlers.updatePswClick);
    }
    /**
     * Отрисовка уведомления об изменении автарки
     * @param {string} [text=''] - текст уведомления
     * @param {boolean} [isErr=false] - тип уведомления(false - ошибка)
     */
    renderMessageAvatar(text = '', isErr = false) {
        if (this._avatarTimerId !== -1) {
            clearTimeout(this._avatarTimerId);
        }
        const div = document.getElementById('div-avatar-bottom');
        div.innerHTML = messageTemplate({text: text});
        const msg = document.getElementById('msg-avatar');
        if (isErr) {
            msg.className += 'profile__text--red';
        } else {
            msg.className += 'profile__text--blue';
        }
        this._avatarTimerId = setTimeout(() => {
            div.removeChild(msg);
            this._avatarTimerId = -1;
        }, 5000);
    }
    /**
     * Отрисовка уведомления об изменении логина или почты
     * @param {string} [text=''] - текст уведомления
     * @param {boolean} [isErr=true] - тип уведомления(true - ошибка)
     */
    renderMsgDataSettings(text = '', isErr = true) {
        if (this._dataTimerId !== -1) {
            clearTimeout(this._dataTimerId);
        }
        const errLine = document.getElementById('text-error-data');
        if (!isErr) {
            errLine.className = 'text-sign';
        }
        errLine.textContent = text;

        this._dataTimerId = setTimeout(() => {
            if (errLine) {
                errLine.textContent = '';
                errLine.className = 'label-error';
            }
            this._dataTimerId = -1;
        }, 5000);
    }
    /**
     * Выделение инпута логина
     */
    renderLoginInputError() {
        const input = document.getElementById('login-profile');
        input.className = 'input-error';
        setTimeout(() => {
            if (input) {
                input.className = 'input-sign';
            }
        }, 5000);
    }
    /**
     * Выделение инпута email
     */
    renderEmailInputError() {
        const input = document.getElementById('email-profile');
        input.className = 'input-error';
        setTimeout(() => {
            if (input) {
                input.className = 'input-sign';
            }
        }, 5000);
    }
    /**
     * Выделение инпута старого пароля
     */
    renderOldPswInputError() {
        const input = document.getElementById('old-psw');
        input.className = 'input-error';
        setTimeout(() => {
            if (input) {
                input.className = 'input-sign';
            }
        }, 5000);
    }
    /**
     * Выделение инпута новых пароля
     */
    renderNewPswInputError() {
        const input1 = document.getElementById('new-psw1');
        const input2 = document.getElementById('new-psw2');
        input1.className = 'input-error';
        input2.className = 'input-error';
        setTimeout(() => {
            if (input1 && input2) {
                input1.className = 'input-sign';
                input2.className = 'input-sign';
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
        if (!isErr) {
            errLine.className = 'text-sign';
        }
        errLine.textContent = text;

        this._pswTimerId = setTimeout(() => {
            if (errLine) {
                errLine.textContent = '';
                errLine.className = 'label-error';
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
        const btnExit = document.getElementById('btn-exit');
        btnExit.removeEventListener('click', this._handlers.signoutClick);

        const btnReload = document.getElementById('btn-reload');
        if (btnReload) {
            btnReload.removeEventListener('click', this._handlers.updateAvatarClick);
        }

        const inputFile = document.getElementById('profile-pic');
        inputFile.removeEventListener('change', this._handlers.updateAvatarBtnRender);
        inputFile.removeEventListener('change', this._handlers.inputAvatarFile);

        const btnSaveData = document.getElementById('btn-save-data');
        btnSaveData.removeEventListener('click', this._handlers.saveDataClick);

        const btnSavePsw = document.getElementById('btn-save-sequr');
        btnSavePsw.removeEventListener('click', this._handlers.updatePswClick);
        this.page.innerHTML = '';
    }
}

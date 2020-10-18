import Events from './../../helpers/eventbus/eventbus';
import {
    UPDATE_PASSWORD,
    PROFILE_RENDER_ERROR,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    UPDATE_AVATAR,
    ERR_UPDATE_AVATAR,
    SIGNOUT,
    REDIRECT,
    PROFILE_USER,
    HAVNT_USER,
    PASSWORD_VALIDATE_ERROR,
} from '../../helpers/eventbus/constants';

// eslint-disable-next-line no-undef
const profileTemplate = require('./profileTemplate.hbs');
// eslint-disable-next-line no-undef
const profileAvatarTemplate = require('./profileAvatarTemplate.hbs');
// eslint-disable-next-line no-undef
const profileButtonTemplate = require('./profileButtonTemplate.hbs');
// eslint-disable-next-line no-undef
const messageTemplate = require('./profileMessage.hbs');


/** Класс представления для страницы профиля */
export default class ProfileView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._model = model;

        this._handlers = {
            render: this.render.bind(this),
            getNewPsw: () => {
                this.renderMessage('Вы успешно поменяли пароль', true);
            },
            pswUpdateError: (arg) => {
                this.renderMessage(arg);
            },
            profileRenderErr: (arg) => {
                this.renderMessage(arg);
            },
            updateAvatar: () => {
                const img = document.getElementById('avatar-img');
                img.innerHTML = profileAvatarTemplate(this._model);
                this.renderMessageAvatar('Аватар успешно изменен');
            },
            errUpdateAvatar: (arg) => {
                this.renderMessageAvatar(arg, true);
            },
            signout: () => {
                Events.trigger(REDIRECT, {url: '/signin'});
            },
            havntUser: () => {
                Events.trigger(REDIRECT, {url: '/signin'});
            },
            pswValidateErr: (arg) => {
                this.renderMessage(arg);
            },
            updatePsw: (arg) => {
                this._model.validate(arg);
            },
            updatePswClick: (evt) => {
                evt.preventDefault();
                const newPass = document.getElementById('profile-password2');
                const oldPass = document.getElementById('profile-password1');
                const newPassword = newPass.value;
                const oldPassword = oldPass.value;
                const btn = document.getElementById('button-save');
                if (btn) {
                    btn.removeEventListener('click', this._handlers.updatePswClick);
                }
                Events.trigger(UPDATE_PASSWORD, {login: '', oldPassword: oldPassword, newPassword: newPassword});
            },
            updateAvatarBtnRender: () => {
                const btnReload = document.getElementById('btn-reload');
                btnReload.innerHTML = profileButtonTemplate();
            },
            inputAvatarFile: (evt) => {
                const inputFile = document.getElementById('profile-pic');
                const btnReload = document.getElementById('btn-reload');
                btnReload.innerHTML = profileButtonTemplate();
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
                const btnReload = document.getElementById('btn-reload');
                const formAvatar = document.getElementById('avatar-form');
                this._model.updateAvatar(formAvatar);
                btnReload.innerHTML = '';
                inputFile.value = '';
            },
            signoutClick: () => {
                this._model.signout();
            },
        };

        if (parent instanceof HTMLElement) {
            this._parent = parent;
        }

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
    }
    /**
     * Подписка на события страницы профиля
     */
    subscribeEvents() {
        Events.subscribe(PROFILE_USER, this._handlers.render);
        Events.subscribe(HAVNT_USER, this._handlers.havntUser);
        Events.subscribe(ERR_UPDATE_AVATAR, this._handlers.errUpdateAvatar);
        Events.subscribe(GET_NEW_PASSWORD, this._handlers.getNewPsw);
        Events.subscribe(PASSWORD_UPDATE_ERROR, this._handlers.pswUpdateError);
        Events.subscribe(PROFILE_RENDER_ERROR, this._handlers.profileRenderErr);
        Events.subscribe(UPDATE_AVATAR, this._handlers.updateAvatar);
        Events.subscribe(SIGNOUT, this._handlers.signout);
        Events.subscribe(PASSWORD_VALIDATE_ERROR, this._handlers.pswValidateErr);
        Events.subscribe(UPDATE_PASSWORD, this._handlers.updatePsw);
    }
    /**
     * Отписка от событий страницы профиля
     */
    unsubscribeEvents() {
        Events.unsubscribe(GET_NEW_PASSWORD, this._handlers.getNewPsw);
        Events.unsubscribe(PASSWORD_UPDATE_ERROR, this._handlers.pswUpdateError);
        Events.unsubscribe(PROFILE_RENDER_ERROR, this._handlers.profileRenderErr);
        Events.unsubscribe(UPDATE_AVATAR, this._handlers.updateAvatar);
        Events.unsubscribe(SIGNOUT, this._handlers.signout);
        Events.unsubscribe(ERR_UPDATE_AVATAR, this._handlers.errUpdateAvatar);
        Events.unsubscribe(UPDATE_PASSWORD, this._handlers.updatePsw);
        Events.unsubscribe(PASSWORD_VALIDATE_ERROR, this._handlers.pswValidateErr);
        Events.unsubscribe(PROFILE_USER, this._handlers.render);
        Events.unsubscribe(HAVNT_USER, this._handlers.havntUser);
    }
    /**
     * Отрисовка страницы профиля
     */
    render() {
        this.page.innerHTML = profileTemplate(this._model);

        // const btn = document.getElementById('button-save');

        // btn.addEventListener('click', this._handlers.updatePswClick);

        const inputFile = document.getElementById('profile-pic');
        const btnReload = document.getElementById('btn-reload');

        inputFile.addEventListener('change', this._handlers.inputAvatarFile);

        btnReload.addEventListener('click', this._handlers.updateAvatarClick);

        const btnExit = document.getElementById('btn-exit');
        btnExit.addEventListener('click', this._handlers.signoutClick);
    }
    /**
     * Отрисовка уведомления об изменении автарки
     * @param {string} [text=''] - текст уведомления
     * @param {boolean} [isErr=false] - тип уведомления(false - ошибка)
     */
    renderMessageAvatar(text = '', isErr = false) {
        const div = document.getElementById('btn-reload');
        div.innerHTML = messageTemplate({text: text});
        const msg = document.getElementById('msg-avatar');
        if (isErr) {
            msg.className = 'label-error';
        }
        this._model.timerId = setTimeout(() => {
            div.removeChild(msg);
            this._model.timerId = -1;
        }, 5000);
    }
    /**
     * Отрисовка уведомления
     * @param {string} [errstr=''] - текст уведомления
     * @param {boolean} [typeMessageFlag=false] - тип уведомления(false - ошибка)
     */
    renderMessage(errstr = '', typeMessageFlag = false) {
        const form = document.getElementById('change-data-form');
        let noticeLine;
        let errLine;
        if (typeMessageFlag) {
            noticeLine = document.getElementById('notice-line');
            errLine = document.getElementById('error-line');
        } else {
            noticeLine = document.getElementById('error-line');
            errLine = document.getElementById('notice-line');
        }
        if (noticeLine === null) {
            noticeLine = document.createElement('div');
            if (this._model.timerId !== -1) {
                clearTimeout(this._model.timerId);
                form.removeChild(errLine);
            }
        } else {
            clearTimeout(this._model.timerId);
            if (errLine !== null) {
                form.removeChild(errLine);
            }
        }

        if (typeMessageFlag) {
            noticeLine.setAttribute('class', 'notice');
            noticeLine.setAttribute('id', 'notice-line');
        } else {
            noticeLine.setAttribute('class', 'error');
            noticeLine.setAttribute('id', 'error-line');
        }
        noticeLine.innerHTML = `<h3>${errstr}</h3>`;

        form.appendChild(noticeLine);

        this._model.timerId = setTimeout(() => {
            form.removeChild(noticeLine);
            this._model.timerId = -1;
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
        btnReload.removeEventListener('click', this._handlers.updateAvatarClick);

        const inputFile = document.getElementById('profile-pic');
        inputFile.removeEventListener('change', this._handlers.updateAvatarBtnRender);

        inputFile.removeEventListener('change', this._handlers.inputAvatarFile);

        const btn = document.getElementById('button-save');
        if (btn) {
            btn.removeEventListener('click', this._handlers.updatePswClick);
        }

        this.page.innerHTML = '';
    }
}

import Events from './../../helpers/eventbus/eventbus';
import {
    UPDATE_PASSWORD,
    PROFILE_RENDER_ERROR,
    GET_NEW_PASSWORD,
    PASSWORD_UPDATE_ERROR,
    UPDATE_AVATAR,
    ERR_UPDATE_AVATAR,
} from '../../helpers/eventbus/constants';

// eslint-disable-next-line no-undef
const profileTemplate = require('./profileTemplate.hbs');
// eslint-disable-next-line no-undef
const profileAvatarTemplate = require('./profileAvatarTemplate.hbs');
// eslint-disable-next-line no-undef
const profileButtonTemplate = require('./profileButtonTemplate.hbs');


/** Класс представления для страницы профиля */
export default class ProfileView {
    /**
     * Инициализация класса
     * @param {HTMLElement} parent - родительский элемент html-страницы
     * @param {any} model - модель
     */
    constructor(parent, model) {
        this._model = model;

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

        Events.subscribe(GET_NEW_PASSWORD, () => {
            this.renderMessage('Вы успешно поменяли пароль', true);
        });
        Events.subscribe(PASSWORD_UPDATE_ERROR, (arg) => {
            this.renderMessage(arg);
        });
        Events.subscribe(PROFILE_RENDER_ERROR, (arg) => {
            this.renderMessage(arg);
        });
    }
    /**
     * Отрисовка страницы профиля
     */
    render() {
        this.page.innerHTML = profileTemplate(this._model);

        Events.subscribe(UPDATE_AVATAR, () => {
            const img = document.getElementById('avatar-img');
            img.innerHTML = profileAvatarTemplate(this._model);
            this.renderMessage('Аватар успешно изменен', true);
        });

        const btn = document.getElementById('button-save');
        const newPass = document.getElementById('password2');
        const oldPass = document.getElementById('password1');
        btn.addEventListener('click', (evt) => {
            evt.preventDefault();
            const newPassword = newPass.value;
            const oldPassword = oldPass.value;
            Events.trigger(UPDATE_PASSWORD, {login: '', oldPassword: oldPassword, newPassword: newPassword});
        });

        const inputFile = document.getElementById('profile_pic');
        const btnReload = document.getElementById('btn-reload');
        const formAvatar = document.getElementById('avatar-form');

        inputFile.addEventListener('change', (evt) => {
            btnReload.innerHTML = profileButtonTemplate();
            const file = evt.target.files[0];
            const reader = new FileReader();
            const img = document.getElementById('img-profile');
            img.title = file.name;
            reader.onload = function(event) {
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
            inputFile.addEventListener('change', () => {
                btnReload.innerHTML = profileButtonTemplate();
            });
        });

        btnReload.addEventListener('click', (evt) => {
            evt.preventDefault();
            this._model.updateAvatar(formAvatar);
            btnReload.innerHTML = '';
            inputFile.value = '';
            Events.subscribe(ERR_UPDATE_AVATAR, (arg) => {
                this.renderMessage(arg, false);
            });
        });

        const btnExit = document.getElementById('btn-exit');
        btnExit.addEventListener('click', () => {
            this._model.signout();
        });
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
}

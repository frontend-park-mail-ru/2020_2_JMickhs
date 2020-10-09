import Net from '../../helpers/network/networking';
import Events from './../../helpers/eventbus/eventbus';

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

        Events.subscribe('getNewPassword', () => {
            this.renderMessage('Вы успешно поменяли пароль', true);
        });
        Events.subscribe('passwordUpdateError', (arg) => {
            this.renderMessage(arg);
        });
        Events.subscribe('profileRenderError', (arg) => {
            this.renderMessage(arg);
        });
    }
    /**
     * Отрисовка страницы профиля
     */
    render() {
        const username = this._model.login;
        this.page.innerHTML = `
        <div class="container">
        <div class="card">
            <div id="avatar-img">
                <img class="avatar" src="${Net.getUrlFile(this._model.avatar)}" alt="Avatar">
            </div>
            <div class="cnt">
                <h3 style="margin-left: 20px;">
                    <b>Пользователь: ${username}</b>
                </h3>
            </div>
            <form id="avatar-form">
            <div style="margin-left: 20px;">
              <label >Выберите изображение для новой аватарки</label>
              <input type="file" id="profile_pic" name="avatar"
                    accept=".jpg, .jpeg, .png">
            </div>
            <br>
          </form>
          <div class="container">
            <button class="btn-red" id="btn-exit">Выйти</button>
            <div id="btn-reload"></div>
          </div>
        </div>
        <form action="" class="ui-form" id="change-data-form">
            <h2>Изменить данные</h2>
            <div class="form-row">
                <input type="password" id="password1"><label for="password">Старый пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password2"><label for="password">Новый пароль</label>
            </div>
            <button class="btn-green" id="button-save" href="">Сохранить</button>
            </div>
        </form>
        
        </div>
        `;

        Events.subscribe('updateAvatar', () => {
            const img = document.getElementById('avatar-img');
            img.innerHTML = `<img class="avatar" src="${Net.getUrlFile(this._model.avatar)}" alt="Avatar">`;
            this.renderMessage('Аватар успешно изменен', true);
        });

        const btn = document.getElementById('button-save');
        const newPass = document.getElementById('password2');
        const oldPass = document.getElementById('password1');
        btn.addEventListener('click', (evt) => {
            evt.preventDefault();
            const newPassword = newPass.value;
            const oldPassword = oldPass.value;
            Events.trigger('updatePassword', {login: '', oldPassword: oldPassword, newPassword: newPassword});
        });

        const inputFile = document.getElementById('profile_pic');
        const btnReload = document.getElementById('btn-reload');
        const formAvatar = document.getElementById('avatar-form');

        inputFile.addEventListener('change', () => {
            btnReload.innerHTML = `            
            <div>
                <button class="btn-green">Обновить аватарку</button>
            </div>
            `;
        });

        btnReload.addEventListener('click', (evt) => {
            evt.preventDefault();
            const response = Net.updateAvatar(new FormData(formAvatar));
            response.then((r) => {
                const status = r.status;
                const err = r.error;
                btnReload.innerHTML = '';
                inputFile.value = '';
                if (status != 200 || err.code != undefined) {
                    this.renderMessage('Аватарку обновить не получилось!', false);
                    return;
                }
                this._model.updateAvatar();
            });
            response.catch(() => {
                this.renderMessage('Аватарку обновить не получилось!', false);
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
        let noticeLine; let errLine;
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

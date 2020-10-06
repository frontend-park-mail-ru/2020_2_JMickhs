import Net from '../../helpers/network/network';

export default class ProfileView {
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

        EventBus.subscribe('getNewPassword', () => {
            alert('Вы успешно поменяли пароль');
        });
        EventBus.subscribe('passwordUpdateError', (arg) => {
            this.renderError(arg);
        });
        EventBus.subscribe('profileRenderError', (arg) => {
            this.renderError(arg);
        });
    }

    render() {
        const username = this._model.login;

        this.page.innerHTML = `
        <div class="container">
        <div class="card">
            <div id="avatar-img">
                <img class="avatar" src="${Net.getUrlFile(this._model.avatar)}" alt="Avatar">
            </div>
            <div class="cnt">
                <h3>
                    <b>Login: ${username}</b>
                </h3>
            </div>
            <form id="avatar-form">
            <div>
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

        EventBus.subscribe('updateAvatar', () => {
            const img = document.getElementById('avatar-img');
            img.innerHTML = `<img class="avatar" src="${Net.getUrlFile(this._model.avatar)}" alt="Avatar">`;
        });

        const btn = document.getElementById('button-save');
        const newPass = document.getElementById('password2');
        const oldPass = document.getElementById('password1');
        btn.addEventListener('click', evt => {
            evt.preventDefault();
            const newPassword = newPass.value;
            const oldPassword = oldPass.value;
            EventBus.trigger('updatePassword', {login: '', oldPassword: oldPassword, newPassword: newPassword });
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
            response.then((status) => {
                if (status !== 200) {
                    const err = document.getElementById('errServ');
                    err.textContent = 'Аватарку обновить не получилось!';
                    err.className = 'error-line';
                    return;
                }
                this._model.updateAvatar();
            });
            response.catch(err => {
                const errLine = document.getElementById('errServ');
                errLine.textContent = `Аватарку обновить не получилось! ${err}`;
                errLine.className = 'error-line';
            });
        });

        let btnExit = document.getElementById('btn-exit');
        btnExit.addEventListener('click', () => {
            this._model.signout();
        });
    }

    renderError(errstr = '') {
        let tmpErr = document.getElementById('error-line');
        if (tmpErr !== null){
            tmpErr.innerHTML = `<h3>${errstr}</h3>`;
            return;
        }

        let errLine = document.createElement('div');
        errLine.setAttribute('class', 'error');
        errLine.setAttribute('id', 'error-line');
        errLine.innerHTML = `<h3>${errstr}</h3>`;

        let form = document.getElementById('change-data-form');
        form.appendChild(errLine);
    }
}
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
            this.renderMessage('Вы успешно поменяли пароль', true);
        });
        EventBus.subscribe('passwordUpdateError', (arg) => {
            this.renderMessage(arg);
        });
        EventBus.subscribe('profileRenderError', (arg) => {
            this.renderMessage(arg);
        });
    }

    render() {
        let username = this._model.login;

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
            let img = document.getElementById('avatar-img');
            img.innerHTML = `<img class="avatar" src="${Net.getUrlFile(this._model.avatar)}" alt="Avatar">`;
            this.renderMessage('Аватар успешно изменен', true);
        });

        let btn = document.getElementById('button-save');
        let newPass = document.getElementById('password2');
        let oldPass = document.getElementById('password1');
        btn.addEventListener('click', evt => {
            evt.preventDefault();
            const newPassword = newPass.value;
            const oldPassword = oldPass.value;
            EventBus.trigger('updatePassword', {login: '', oldPassword: oldPassword, newPassword: newPassword });
        });

        let inputFile = document.getElementById('profile_pic');
        let btnReload = document.getElementById('btn-reload');
        let formAvatar = document.getElementById('avatar-form');

        inputFile.addEventListener('change', () => {
            btnReload.innerHTML = `            
            <div>
                <button class="btn-green">Обновить аватарку</button>
            </div>
            `;
        });



        btnReload.addEventListener('click', (evt) => {
            evt.preventDefault();
            let response = Net.updateAvatar(new FormData(formAvatar));
            response.then((status) => {
                if (status !== 200) {
                    let err =  document.getElementById('errServ');
                    err.textContent = 'Аватарку обновить не получилось!';
                    err.className = 'error-line';
                    return;
                }
                this._model.updateAvatar();
            });
            response.catch(err => {
                let errLine =  document.getElementById('errServ');
                errLine.textContent = `Аватарку обновить не получилось! ${err}`;
                errLine.className = 'error-line';
            });
        });

        let btnExit = document.getElementById('btn-exit');
        btnExit.addEventListener('click', () => {
            this._model.signout();
        });
    }

    renderMessage(errstr = '', typeMessageFlag = false) {
        let tmpNotice = document.getElementById('notice-line');
        if (tmpNotice !== null){
            tmpNotice.innerHTML = `<h3>${errstr}</h3>`;
            if (typeMessageFlag) {
                tmpNotice.style.color = '#6996D3';
            } else {
                tmpNotice.style.color = '#B22222';
            }
            return;
        }

        let noticeLine = document.createElement('div');
        noticeLine.setAttribute('class', 'notice');
        noticeLine.setAttribute('id', 'notice-line');
        if (typeMessageFlag) {
            noticeLine.style.color = '#6996D3';
        } else {
            noticeLine.style.color = '#B22222';
        }
        noticeLine.innerHTML = `<h3>${errstr}</h3>`;

        let form = document.getElementById('change-data-form');
        form.appendChild(noticeLine);
    }
}
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
    }

    render() {
        let username = this._model.login;

        this.page.innerHTML = `
        <div class="container">
        <div class="card">
            <img class="avatar" src="https://cs5.pikabu.ru/images/big_size_comm/2015-10_4/1445372410115880547.png" alt="Avatar">
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
            <br>
            <div id="btn-reload"></div>
          </form>
        </div>
        <form action="" class="ui-form">
            <h2>Изменить данные</h2>
            <div class="form-row">
                <input type="text" id="email"><label for="password">Login</label>
            </div>
            <div class="form-row">
                <input type="password" id="password1"><label for="password">Старый пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password2"><label for="password">Новый пароль</label>
            </div>
            <button class="btn" id="button-save" href="/profile.html">Сохранить</button>
        </form>
        </div>
        `;

        let btn = document.getElementById('button-save');
        let pass = document.getElementById('password2');
        btn.addEventListener('click', evt => {
            evt.preventDefault();
            const password = pass.value.trim();
            EventBus.trigger('updatePassword', { password: password });
        });

        let inputFile = document.getElementById('profile_pic');
        let btnReload = document.getElementById('btn-reload');
        let formAvatar = document.getElementById('avatar-form');

        inputFile.addEventListener('change', () => {
            btnReload.innerHTML = `            
            <div>
                <button class="btn">Обновить аватарку</button>
            </div>
            `;
        });
        btnReload.addEventListener('click', (evt) => {
            evt.preventDefault();
            let response = Net.updateAvatar(new FormData(formAvatar));
            response.then((response) => {
            });
        });

    }
}
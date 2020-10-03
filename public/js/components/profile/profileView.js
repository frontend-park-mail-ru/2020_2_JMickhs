import UserModel from './usermodel'

export default class ProfileView {
    constructor(parent, model) {
        if (model instanceof UserModel && parent instanceof HTMLElement) {
            this._model = model;
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
            <button class="btn" href="/profile.html">Сохранить</button>
        </form>
        </div>
        `;
    }
}
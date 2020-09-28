import EventEmitter from '../prototypes/eventemitter'

export class ProfileController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }
    activate() {
        if (this.model.isAuth) {
            this.view.show();
            return;
        }
        document.location.href = "#/signin"
    }
}

export class ProfileView extends EventEmitter {
    constructor(model, elements) {
        super();
        this.model = model;
        this.app = document.getElementById('app');
        this.navbar = elements.navbar;
    }

    show() {
        let username = this.model.login;
        this.navbar.el3 = { text: `${username}`, ref: '#/profile' };

        this.app.innerHTML = this.app.innerHTML = this.navbar.render() + `
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
import EvenEmitter from '../../helpers/prototypes/eventemitter'
import UserModel from '../usermodel/usermodel'

export class SigninController {
    constructor(view, model) {
        if (view instanceof SigninView && model instanceof SigninModel) {
            this._view = view;
            this._model = model;
        }
        this._view.subscribe(this._view.submitEvent, (arg) => {
            this._model.signin(arg.login, arg.password);
        });
    }
    activate() {
        if (this._model.isAuth()) {
            document.location.href = "#/profile";
            return;
        }
        this._view.show();
    }
}

export class SigninView extends EvenEmitter {
    constructor(parent, model) {
        super();
        this.submitEvent = 'submitEvent';
        if (parent instanceof HTMLElement && model instanceof SigninModel) {
            this._parent = parent;
            this._model = model;
        }
        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
    }
    show() {
        this.page.innerHTML = `
        <div class="container"></div>
        <form action="" class="ui-form" id="signinform">
            <h2>Вход в аккаунт</h2>
            <div class="form-row">
                <input type="text" id="login"><label for="login">Логин</label>
            </div>
            <div class="form-row">
                <input type="password" id="password"><label for="password">Пароль</label>
            </div>
            <span class="psw">Нету аккаунта? 
                <a href="#/signup">Регистрация</a>
            </span>
            <button class="btn" type="submit" id="btnsignin">Вход</button>
        </form>
        </div>
        `;
        let form = document.getElementById('signinform')
        let loginInput = document.getElementById('login')
        let passInput = document.getElementById('password')

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value.trim();
            const password = passInput.value.trim();
            this.trigger(this.submitEvent, { login: login, password: password });
        });
    }
}

export class SigninModel extends EvenEmitter {
    constructor(modelUser) {
        super();
        this.updateEvent = 'updateEvent';

        if (modelUser instanceof UserModel) {
            this._user = modelUser;
        }
        this._user.subscribe(this._user.updateEvent, () => {
            if (this._user.isAuth) {
                document.location.href = "#/profile";
            } else {
                document.location.href = "#/error";
            }

        });
    }
    signin(username, password) {
        this._user.signin(username, password);
    }
    isAuth() {
        return this._user.isAuth;
    }
}
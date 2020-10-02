import EvenEmitter from '../../helpers/prototypes/eventemitter'
import UserModel from '../usermodel/usermodel'

export class SigninController {
    constructor(view, model) {
        if (view instanceof SigninView && model instanceof SigninModel) {
            this._view = view;
            this._model = model;
        }
        this._view.subscribe(this._view.submitEvent, (arg) => {
            let { login, password } = arg;
            let canSend = true;
            if (login === '') {
                this._view.showErrLogin(true, 'Введите логин!');
                canSend = false;
            } else {
                this._view.showErrLogin(false);
            }
            if (password === '') {
                this._view.showErrPassword(true, 'Введите пароль!');
                canSend = false;
            } else {
                this._view.showErrPassword(false);
            }

            if (canSend) {
                this._model.signin(arg.login, arg.password);
            }
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
        this._model.subscribe(this._model.errSigninEvent, () => {
            this.showErrServer(true, 'Неправильный логин или пароль!');
        })

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
            <h3 class="dontErrorLine" id="errLogin">...</h3>
            <div class="form-row"">
                <input type="password" id="password"><label for="password">Пароль</label>
            </div>
            <h3 class="dontErrorLine" id="errPassword">...</h3>
            <span class="psw">Нету аккаунта? 
                <a href="#/signup">Регистрация</a>
            </span>
            <div class="form-row"">
                <button class="btn" type="submit" id="btnsignin">Вход</button>
            </div>
            <h3 class="dontErrorLine" id="errServ">...</h3>
            
        </form>
        </div>
        `;
        let form = document.getElementById('signinform');
        let loginInput = document.getElementById('login');
        let passInput = document.getElementById('password');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value.trim();
            const password = passInput.value.trim();
            this.trigger(this.submitEvent, { login: login, password: password });
        });


    }
    showErrLogin(isErr, errstr = '') {
        let h3 = document.getElementById('errLogin');
        h3.textContent = errstr;
        if (isErr) {
            h3.className = 'errorLine';
        } else {
            h3.className = 'dontErrorLine';
        }

    }
    showErrPassword(isErr, errstr = '') {
        let h3 = document.getElementById('errPassword');
        h3.textContent = errstr;
        if (isErr) {
            h3.className = 'errorLine';
        } else {
            h3.className = 'dontErrorLine';
        }
    }
    showErrServer(isErr, errstr = '') {
        let h3 = document.getElementById('errServ');
        h3.textContent = errstr;
        if (isErr) {
            h3.className = 'errorLine';
        } else {
            h3.className = 'dontErrorLine';
        }
    }
}

export class SigninModel extends EvenEmitter {
    constructor(modelUser) {
        super();

        this.errSigninEvent = 'errSigin';

        this.requested = false;

        if (modelUser instanceof UserModel) {
            this._user = modelUser;
        }
        this._user.subscribe(this._user.updateEvent, () => {
            if (this.requested === false) {
                return;
            }
            if (this._user.isAuth) {
                document.location.href = "#/profile";
                return;
            } else {
                this.trigger(this.errSigninEvent);
            }

        });
    }
    signin(username, password) {
        this.requested = true;
        this._user.signin(username, password);
    }
    isAuth() {
        return this._user.isAuth;
    }
}
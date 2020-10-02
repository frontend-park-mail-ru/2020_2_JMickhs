import EvenEmitter from '../../helpers/prototypes/eventemitter'
import UserModel from '../usermodel/usermodel'

export class SignupController {
    constructor(view, model) {
        if (view instanceof SignupView && model instanceof SignupModel) {
            this._view = view;
            this._model = model;
        }
        this._view.subscribe('signup', (arg) => {
            let pass1 = arg.password1;
            let pass2 = arg.password2;
            let login = arg.login;
            if (pass1 != pass2) {
                console.log('пароли не равны', pass1, pass2)
                alert('пароли не равны');
                return;
            }
            this._model.signup(login, pass1)
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

export class SignupView extends EvenEmitter {
    constructor(parent, model) {
        super();
        this.submitEvent = 'submitEvent';
        if (parent instanceof HTMLElement && model instanceof SignupModel) {
            this._parent = parent;
            this._model = model;
        }
        this._model.subscribe(this._model.errSignupEvent, () => {
            // вывести ошибку регистрации
            // TODO:
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
        <form action="" class="ui-form" id="signupform">
            <h2>Заполните поля для регистрации</h2>
            <div class="form-row">
                <input type="text" id="login"><label for="login">Логин</label>
            </div>
            <div class="form-row">
                <input type="password" id="password1"><label for="password">Пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password2"><label for="password">Повторите пароль</label>
            </div>
            <span class="psw">     Есть аккаунт?
                <a href="#/signin">Войдите</a>
            </span>
            <button class="btn">Регистрация</button>
        </form>
        </div>
        `;

        let form = document.getElementById('signupform')
        let loginInput = document.getElementById('login')
        let passInput1 = document.getElementById('password1')
        let passInput2 = document.getElementById('password2')

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value.trim();
            const pass1 = passInput1.value.trim();
            const pass2 = passInput2.value.trim();
            this.trigger('signup', { login: login, password1: pass1, password2: pass2 });
        });
    }
}

export class SignupModel extends EvenEmitter {
    constructor(modelUser) {
        super();

        this.errSigninEvent = 'errSigin';

        this.requested = false;

        if (modelUser instanceof UserModel) {
            this._user = modelUser;
        }
        this._user.subscribe(this._user.updateEvent, () => {
            if (!this.requested) {
                return;
            }
            if (this._user.isAuth) {
                document.location.href = "#/profile";
                return;
            } else {
                this.trigger(this.errSignupEvent);
            }

        });
    }
    signup(username, password) {
        this.requested = true;
        this._user.signup(username, password);
    }
    isAuth() {
        return this._user.isAuth;
    }
}
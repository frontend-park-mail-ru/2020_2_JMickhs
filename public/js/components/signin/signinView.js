import SigninModel from './signinModel';

export default class SigninView {
    constructor(parent, model) {
        if (parent instanceof HTMLElement && model instanceof SigninModel) {
            this._parent = parent;
            this._model = model;
        }
        EventBus.subscribe('errorSignin', () => {
            this.renderErrServer(true, 'Неправильный логин или пароль!');
        });

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
    }
    render() {
        this.page.innerHTML = `
        <div class="container"></div>
        <form action="" class="ui-form" id="signinform">
            <h2>Вход в аккаунт</h2>
            <div class="form-row">
                <input type="text" id="login"><label for="login">Логин</label>
            </div>
            <h3 class="dont-error-line" id="errLogin">...</h3>
            <div class="form-row"">
                <input type="password" id="password"><label for="password">Пароль</label>
            </div>
            <h3 class="dont-error-line" id="errPassword">...</h3>
            <span class="psw">Нет аккаунта? 
                <a href="#/signup">Регистрация</a>
            </span>
            <div class="form-row"">
                <button class="btn" type="submit" id="btnsignin">Вход</button>
            </div>
            <h3 class="dont-error-line" id="errServ">...</h3>
            
        </form>
        </div>
        `;
        let form = document.getElementById('signinform');
        let loginInput = document.getElementById('login');
        let passInput = document.getElementById('password');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const password = passInput.value;
            EventBus.trigger('submitSignin', { login: login, password: password });
        });

    }
    renderErrLogin(isErr, errstr = '') {
        let h3 = document.getElementById('errLogin');
        h3.textContent = errstr;
        if (isErr) {
            h3.className = 'error-line';
        } else {
            h3.className = 'dont-error-line';
        }

    }
    renderErrPassword(isErr, errstr = '') {
        let h3 = document.getElementById('errPassword');
        h3.textContent = errstr;
        if (isErr) {
            h3.className = 'error-line';
        } else {
            h3.className = 'dont-error-line';
        }
    }
    renderErrServer(isErr, errstr = '') {
        let h3 = document.getElementById('errServ');
        h3.textContent = errstr;
        if (isErr) {
            h3.className = 'error-line';
        } else {
            h3.className = 'dont-error-line';
        }
    }
}
import SignupModel from './signupModel';

export default class SignupView {
    constructor(parent, model) {
        this.submitEvent = 'submitEvent';
        if (parent instanceof HTMLElement && model instanceof SignupModel) {
            this._parent = parent;
            this._model = model;
        }
        EventBus.subscribe('errorSignup', (arg) => {
            this.renderError(arg);
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
        <form action="" class="ui-form" id="signupform">
            <h2>Заполните поля для регистрации</h2>
            <div class="form-row">
                <input type="text" id="login"><label for="login">Логин</label>
            </div>
            <div class="form-row">
                <input type="text" id="password1"><label for="password">Пароль</label>
            </div>
            <div class="form-row">
                <input type="text" id="password2"><label for="password">Повторите пароль</label>
            </div>
            <span class="psw">     Есть аккаунт?
                <a href="signin">Войдите</a>
            </span>
            <button class="btn-green">Регистрация</button>
        </form>
        </div>
        `;

        let form = document.getElementById('signupform');
        let loginInput = document.getElementById('login');
        let passInput1 = document.getElementById('password1');
        let passInput2 = document.getElementById('password2');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const pass1 = passInput1.value;
            const pass2 = passInput2.value;
            EventBus.trigger('submitSignup', { login: login, password1: pass1, password2: pass2 });
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

        let form = document.getElementById('signupform');
        this.page.appendChild(errLine);
    }
}

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

        EventBus.subscribe('logRenderError', (arg) => {
            this.renderError(arg);
        });
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
                <input type="password" id="password1"><label for="password">Пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password2"><label for="password">Повторите пароль</label>
            </div>
            <p class="hotel-card-text">Есть аккаунт?
                <a href="/signin" class="refer">Авторизация</a>
            </p>
            <button class="btn-green">Регистрация</button>
        </form>
        </div>
        `;

        const form = document.getElementById('signupform');
        const loginInput = document.getElementById('login');
        const passInput1 = document.getElementById('password1');
        const passInput2 = document.getElementById('password2');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const pass1 = passInput1.value;
            const pass2 = passInput2.value;
            EventBus.trigger('submitSignup', { login: login, password1: pass1, password2: pass2 });
        });
    }

    renderError(errstr = '') {
        if (this._model.timerId !== -1){
            clearTimeout(this._model.timerId);
            const tmpErr = document.getElementById('notice-line');
            tmpErr.innerHTML = `<h3>${errstr}</h3>`;

            this._model.timerId = setTimeout( () => {
                const form = document.getElementById('signupform');
                form.removeChild(tmpErr);
                this._model.timerId = -1;
            }, 5000);
            return;
        }

        const errLine = document.createElement('div');
        errLine.setAttribute('class', 'notice');
        errLine.setAttribute('id', 'notice-line');
        errLine.innerHTML = `<h3>${errstr}</h3>`;

        const form = document.getElementById('signupform');
        form.appendChild(errLine);

        this._model.timerId = setTimeout( () => {
            form.removeChild(errLine);
            this._model.timerId = -1;
        }, 5000);
    }
}

import SigninModel from './signinModel';

export default class SigninView {
    constructor(parent, model) {
        if (parent instanceof HTMLElement && model instanceof SigninModel) {
            this._parent = parent;
            this._model = model;
        }
        EventBus.subscribe('errorSignin', (arg) => {
            this.renderError(arg);
        });

        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;

        EventBus.subscribe('authRenderError', (arg) => {
            this.renderError(arg);
        });
    }
    render() {
        this.page.innerHTML = `
        <div class="container"></div>
        <form action="" class="ui-form" id="signinform">
            <h2>Вход в аккаунт</h2>
            <div class="form-row">
                <input type="text" id="login"><label for="login">Логин</label>
            </div>
            <div class="form-row"">
                <input type="password" id="password"><label for="password">Пароль</label>
            </div>
            <p class="hotel-card-text">Нет аккаунта? 
                <a href="/signup" class="refer">Регистрация</a>
            </p>
            <div class="form-row"">
                <button class="btn-green" type="submit" id="btnsignin">Вход</button>
            </div>
        </form>
        </div>
        `;

        const form = document.getElementById('signinform');
        const loginInput = document.getElementById('login');
        const passInput = document.getElementById('password');

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const login = loginInput.value;
            const password = passInput.value;
            EventBus.trigger('submitSignin', { login: login, password: password });
        });

    }

    renderError(errstr = '') {
        if (this._model.timerId !== -1){
            clearTimeout(this._model.timerId);
            const tmpErr = document.getElementById('notice-line');
            tmpErr.innerHTML = `<h3>${errstr}</h3>`;

            this._model.timerId = setTimeout(() => {
                const form = document.getElementById('signinform');
                form.removeChild(tmpErr);
                this._model.timerId = -1;
            }, 5000);
            return;
        }

        const errLine = document.createElement('div');
        errLine.setAttribute('class', 'notice');
        errLine.setAttribute('id', 'notice-line');
        errLine.innerHTML = `<h3>${errstr}</h3>`;

        const form = document.getElementById('signinform');
        form.appendChild(errLine);

        this._model.timerId = setTimeout( () => {
            form.removeChild(errLine);
            this._model.timerId = -1;
        }, 5000);
    }
}
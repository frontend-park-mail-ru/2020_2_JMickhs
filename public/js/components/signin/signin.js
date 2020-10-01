import EvenEmitter from '../../helpers/prototypes/eventemitter'


export class SigninController {
    constructor(view, model) {
        if (view instanceof SigninView && model instanceof SigninModel) {
            this._view = view;
            this._model = model;
        }
    }
    activate() {
        this._view.show();
    }
}

export class SigninView extends EvenEmitter {
    constructor(parent, model) {
        super();
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
                <input type="text" id="email"><label for="email">Email</label>
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
        let emailInput = document.getElementById('email')
        let passInput = document.getElementById('password')
    }
}

export class SigninModel extends EvenEmitter {
    constructor() {
        super();
    }
}
import EventEmitter from '../../../helpers/prototypes/eventemitter'

// MVC for SignIn
export class SigninController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.subscribe('signin', (arg) => {
            model.signin(arg.email, arg.password);
        });
    }
    activate() {
        this.view.show();
    }
}

export class SigninView extends EventEmitter {
    constructor(model, elements) {
        super();
        this.model = model;
        this.app = document.getElementById('app');
        this.model.subscribe('signinResponse', (arg) => {
            console.log(arg.response);
        });

        this.navbar = elements.navbar;
    }
    show() {
        this.navbar.el3 = { text: 'Авторизация', ref: '#/signin' };
        this.app.innerHTML = this.navbar.render() + `
        
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


        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const email = emailInput.value.trim();
            const pass = passInput.value.trim();
            this.do('signin', { email: email, password: pass });
        });
    }
}
class SignUpController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
    }
    activate() {
        this.view.show();
    }
}

class SignUpView extends EventEmitter {
    constructor() {
        super();
        this.app = document.getElementById('app');
    }
    show() {
        let nav = new Navbar();
        nav.el3 = { text: 'Регистрация', ref: '#/signup' }
        this.app.innerHTML = nav.render() + `
        <div class="container"></div>
        <form action="" class="ui-form">
            <h2>Заполните поля для регистрации</h2>
            <div class="form-row">
                <input type="text" id="email"><label for="email">Email</label>
            </div>
            <div class="form-row">
                <input type="password" id="password"><label for="password">Пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password"><label for="password">Повторите пароль</label>
            </div>
            <span class="psw">     Есть аккаунт?
                <a href="#/signin">Войдите</a>
            </span>
            <button class="btn">Регистрация</button>
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

function createSignUpController() {
    let model = new UserModel();
    let view = new SignUpView(model);
    let controller = new SignUpController(view, model);
    return controller;
}
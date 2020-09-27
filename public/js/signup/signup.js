class SignupController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.subscribe('signup', (arg) => {

        });
    }
    activate() {
        this.view.show();
    }
}

class SignupView extends EventEmitter {
    constructor(model, elements) {
        super();
        this.app = document.getElementById('app');
        this.model = model;

        this.navbar = elements.navbar;
    }
    async show() {
        this.navbar.el3 = { text: 'Регистрация', ref: '#/signup' }
        this.app.innerHTML = this.navbar.render() + `
        <div class="container"></div>
        <form action="" class="ui-form" id="signupform">
            <h2>Заполните поля для регистрации</h2>
            <div class="form-row">
                <input type="text" id="email"><label for="email">Email</label>
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
        let emailInput = document.getElementById('email')
        let passInput1 = document.getElementById('password1')
        let passInput2 = document.getElementById('password2')

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const email = emailInput.value.trim();
            const pass1 = passInput1.value.trim();
            const pass2 = passInput2.value.trim();
            this.do('signup', { email: email, password1: pass1, password2: pass2 });
        });
    }
}
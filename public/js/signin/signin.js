// MVC for SignIn
class SigninController {
    constructor(view, model) {
        this.view = view;
        this.model = model;
        this.view.subscribe('signin', (arg) => {
            console.log('вызовем signin у модели', arg);
            model.signin(arg.email, arg.password);
        });
    }
    activate() {
        this.view.show();
    }
}

class SignInView extends EventEmitter {
    constructor(model) {
        super();
        this.model = model;
        this.app = document.getElementById('app');
    }
    show() {
        let navbar = new Navbar();
        this.app.innerHTML = navbar.render('home', 'list', 'signin', 2) + `
        
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
                <a href="/signup.html">Регистрация</a>
            </span>
            <button class="btn" type="submit" id="btnsignin">Вход</button>
        </form>
        </div>
        `;
        let form = document.getElementById('signinform')
        let emailInput = document.getElementById('email')
        let passInput = document.getElementById('password')
        let btn = document.getElementById('btnsignin')

        form.addEventListener('submit', (evt) => {
            evt.preventDefault();
            const email = emailInput.value.trim();
            const pass = passInput.value.trim();
            this.do('signin', { email: email, password: pass });
        });
    }
}

class UserModel extends EventEmitter {
    constructor() {
        super();
        this.isAuth = false;
        this.id = -1;
        this.login = '';
    }
    signin(username, password) {
        ajax(
            'POST',
            'http://89.208.197.127:8080/api/v1/signin', { username, password },
            (status, response) => {
                console.log(status);
                console.log(response);
            }
        )
    }
}

function createSigninController() {
    let model = new UserModel();
    let view = new SignInView(model);
    let controller = new SigninController(view, model);
    return controller;
}
// заглушка контроллера для страницы входа
class SigninController {
    constructor() {
        this.app = document.getElementById('app');
    }
    activate() {
        // html из hw1/home.html
        let navbar = new Navbar();
        this.app.innerHTML = navbar.render('home', 'list', 'signin', 2) + `
        <div class="container"></div>
        <form action="" class="ui-form">
        <h2>Вход в аккаунт</h2>
        <div class="form-row">
            <input type="text" id="email" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required autocomplete="off"><label for="email">Email</label>
        </div>
        <div class="form-row">
            <input type="password" id="password" required autocomplete="off"><label for="password">Пароль</label>
        </div>
        <span class="psw">Нету аккаунта? 
            <a href="/signup.html">Регистрация</a>
        </span>
        </form>
        <button class="btn" href="/profile.html">Вход</button>
        </div>
        `
    }
}

function createSigninController() {
    return new SigninController();
}
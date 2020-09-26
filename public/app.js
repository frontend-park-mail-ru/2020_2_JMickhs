// 'use strict'
// import { testHello } from './test/test'

const application = document.getElementById('app');

//Components
const HomePage = {
    render: () => {
        return `
        <ul class="menu-main">
        <li><a href="/" class="current">HotelScanner</a></li>
        <li><a href="#/list">Список отелей</a></li>
        <li><a href="#/signin">Авторизация</a></li>
        </ul>
        <p style="text-align: center;">Главная страница для отработки всех других, и позже роутера</p>
        <p style="text-align: center;">На главной странице должен быть поиск</p>
        <p style="text-align: center;">На первом этапе без поиска не очень понятно, что тут будет</p>
      `;
    }
}

const ListPage = {
    render: () => {
        return `
        <body>
        <ul class="menu-main">
        <li><a href="/">HotelScanner</a></li>
        <li><a href="#/list" class="current">Список отелей</a></li>
        <li><a href="#/signin">Авторизация</a></li>
        </ul>
        <h2>Тут должен быть список всех отелей</h2>
        </body>
      `;
    }
}

const AuthPage = {
    render: () => {
        return `
        <ul class="menu-main">
        <li><a href="/">HotelScanner</a></li>
        <li><a href="#/list">Список отелей</a></li>
        <li><a href="#/signin" class="current">Авторизация</a></li>
        </ul>

        <form action="" class="ui-form" id="loginform">
        <h2 style="text-align: center; color: #4a90e2;">Вход в аккаунт</h2>
        <div class="form-row">
            <input type="text" id="email" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required autocomplete="off"><label for="email">Email</label>
        </div>
        <div class="form-row">
            <input type="password" id="password" required autocomplete="off"><label for="password">Пароль</label>
        </div>
        <span class="psw">Нету аккаунта? 
            <a href="#/signup">Регистрация</a>
        </span>
        <br>
        <br>
        <br>
        <button class="btn" id="btnAuth" style="text-align: center; margin-bottom: 20px;">Вход</button>
        </form>
      `;
    }
}

const RegPage = {
    render: () => {
        return `
        <ul class="menu-main">
        <li><a href="/">HotelScanner</a></li>
        <li><a href="#/list">Список отелей</a></li>
        <li><a href="#/signin" class="current">Авторизация</a></li>
        </ul>

        <div class="container"></div>
        <form action="" class="ui-form">
            <h2>Заполните поля для регистрации</h2>
            <div class="form-row">
                <input type="text" required autocomplete="off"><label for="email">ФИО</label>
            </div>
            <div class="form-row">
                <input type="text" id="email" pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}" required autocomplete="off"><label for="email">Email</label>
            </div>
            <div class="form-row">
                <input type="tel" id="tel" pattern="(\+?\d[- .]*){7,13}" required autocomplete="off"><label for="email">Телефон</label>
            </div>
            <div class="form-row">
                <input type="password" id="password" required autocomplete="off"><label for="password">Пароль</label>
            </div>
            <div class="form-row">
                <input type="password" id="password" required autocomplete="off"><label for="password">Повторите пароль</label>
            </div>
            <span class="psw">     Есть аккаунт?
                <a href="/signin.html">Войдите</a>
            </span>
        </form>
        <button class="btn" href="/profile.html">Регистрация</button>
        </div>
      `;
    }
}

const ErrorPage = {
    render: () => {
        return `
        <section>
          <h1>Error</h1>
          <p>This is just a test</p>
        </section>
      `;
    }
}

function ajax(method, url, body = null, callback) {
    const xhr = new XMLRequest();
    xhr.open(method, url, true);
    //xhr.withCredentials = false;

    xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
    });

    if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
    }

    xhr.send();

}

function signupPageRender() {
    application.innerHTML = AuthPage.render()
    let form = document.getElementById('loginform')
    let emailInput = document.getElementById('email')
    let passInput = document.getElementById('password')

    let btn = document.getElementById('btnAuth')
    btn.type = 'submit';
    btn.value = 'Авторизироваться!';
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        let username = 'kek@gmail.com'
        let Password = '12345'
        ajax(
            'POST',
            'http://81.163.28.77:8080/api/v1/signin', { username, Password },
            (status, response) => {
                console.log(status);
                console.log(response);
            }
        )
    });
}

const routes = [
    { path: '/', component: HomePage, },
    { path: '/list', component: ListPage, },
    { path: '/signin', component: AuthPage, },
    { path: '/signup', component: RegPage, },
];

const router = new Router(routes);
router.start()
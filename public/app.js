// 'use strict'

console.log('i am start!!!')

// import Test from './js/router'
// Test.hello()


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
            <a href="/signup.html">Регистрация</a>
        </span>
        <br>
        <br>
        <br>
        <button class="btn" id="btnAuth" style="text-align: center; margin-bottom: 20px;">Вход</button>
        </form>
      `;
    }
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
        //console.log('oops')
    });
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
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.withCredentials = true;

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



const routes = [
    { path: '/', component: HomePage, },
    { path: '/list', component: ListPage, },
    { path: '/signin', component: AuthPage, },
];


// роутер, работает только по якорям, надо доработать =)
class Router {
    constructor(config) {
        this.routes = config;
    }

    parseLocation() {
        //console.log(location.pathname)
        return location.hash.slice(1).toLowerCase() || '/';
    }

    findComponentByPath(path) {
        return this.routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;
        // gm - это многострочный текст парни (вроде как)
    }

    async route() {
        const path = this.parseLocation();
        const { component } = this.findComponentByPath(path) || { component: ErrorPage };
        if (component === AuthPage) {
            signupPageRender();
        } else {
            application.innerHTML = component.render();
        }

    }

    start() {
        window.addEventListener('hashchange', this.route.bind(this));
        window.addEventListener('load', this.route.bind(this));
        //window.addEventListener('popstate', this.route.bind(this));
    }
}

let router = new Router(routes);
router.start()
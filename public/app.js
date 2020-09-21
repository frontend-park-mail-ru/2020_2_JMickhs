console.log('i am start!!!')

// Components
const HomeComponent = {
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

const Page1Component = {
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

const Page2Component = {
    render: () => {
        return `
        <ul class="menu-main">
        <li><a href="/">HotelScanner</a></li>
        <li><a href="#/list">Список отелей</a></li>
        <li><a href="#/signin" class="current">Авторизация</a></li>
    </ul>

    <form action="" class="ui-form">
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
        <button class="btn" style="text-align: center; margin-bottom: 20px;" href="/profile.html">Вход</button>
    </form>
      `;
    }
}

const ErrorComponent = {
    render: () => {
        return `
        <section>
          <h1>Error</h1>
          <p>This is just a test</p>
        </section>
      `;
    }
}

const routes = [
    { path: '/', component: HomeComponent, },
    { path: '/list', component: Page1Component, },
    { path: '/signin', component: Page2Component, },
];

const parseLocation = () => location.hash.slice(1).toLowerCase() || '/';

const findComponentByPath = (path, routes) => routes.find(r => r.path.match(new RegExp(`^\\${path}$`, 'gm'))) || undefined;

const router = () => {
    // Find the component based on the current path
    const path = parseLocation();
    // If there's no matching route, get the "Error" component
    const { component = ErrorComponent } = findComponentByPath(path, routes) || {};
    console.log(path)
    document.getElementById('app').innerHTML = component.render();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
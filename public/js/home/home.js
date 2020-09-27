// заглушка контроллера для главной страницы
class HomeController {
    constructor() {
        this.app = document.getElementById('app');
    }
    activate() {
        // html из hw1/home.html
        let navbar = new Navbar();
        this.app.innerHTML = navbar.render() + `
        <p class="text-first">Главная страница для отработки всех других, и позже роутера</p>
        <p class="text">На главной странице должен быть поиск</p>
        <p class="text">На первом этапе без поиска не очень понятно, что тут будет</p>
        `
    }
}

function createHomeContoller() {
    return new HomeController();
}
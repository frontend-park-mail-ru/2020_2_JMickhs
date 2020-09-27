// заглушка контроллера для главной страницы
class HomeController {
    constructor(view) {
        this.app = document.getElementById('app');
        this.view = view;
    }
    activate() {
        this.view.show();
    }
}

class HomeView {
    constructor(elements) {
        this.app = document.getElementById('app');

        this.navbar = elements.navbar;
    }
    show() {
        // html из hw1/home.html
        this.app.innerHTML = this.navbar.render() + `
        <p class="text-first">Главная страница для отработки всех других, и позже роутера</p>
        <p class="text">На главной странице должен быть поиск</p>
        <p class="text">На первом этапе без поиска не очень понятно, что тут будет</p>
        `;
    }
}

function createHomeContoller() {
    return new HomeController();
}
//заглушка
export class HomeController {
    constructor(parent) {
        if (parent instanceof HTMLElement) {
            this._parent = parent;
        }
        let page = document.getElementById('page');
        if (page === null) {
            page = document.createElement('div');
            page.id = 'page';
            this._parent.appendChild(page);
        }
        this.page = page;
    }
    activate() {
        this.page.innerHTML = `
        <p class="text-first">Главная страница для отработки всех других, и позже роутера</p>
        <p class="text">На главной странице должен быть поиск</p>
        <p class="text">На первом этапе без поиска не очень понятно, что тут будет</p>
        `;
    }
}
class Navbar {
    constructor() {
        this.el1 = { text: 'HotelScanner', ref: '#/' };
        this.el2 = { text: 'Список отелей', ref: '#/list' };
        this.el3 = { text: 'Авторизация', ref: '#/signin' };
    }
    render() {
        TODO: return `
        <ul class="menu-main">
        <li>
            <a href="${this.el1.ref}">${this.el1.text}</a>
        </li>
        <li>
            <a href="${this.el2.ref}">${this.el2.text}</a>
        </li>
        <li>
            <a href="${this.el3.ref}">${this.el3.text}</a>    
        </li>
        </ul>
        `
    }
}
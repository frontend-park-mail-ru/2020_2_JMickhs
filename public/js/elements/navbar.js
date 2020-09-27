class Navbar {
    render(line1, line2, line3, active) {
        // проверки на типы TODO:
        return `
        <ul class="menu-main">
        <li>
            <a href="/">${line1}</a>
        </li>
        <li>
            <a href="#/list">${line2}</a>
        </li>
        <li>
            <a href="#/signin">${line3}</a>
        </li>
        </ul>
        `
    }
}
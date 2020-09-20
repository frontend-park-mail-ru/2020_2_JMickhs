console.log('i am start!!!')


import NavBar from './elements/navbar.html'

const application = document.getElementById('app')

// const config = {
//     menu: {
//         href: '/menu',
//         text: 'Главная',
//         open: mainPage,
//     },
// signup: {
//     href: '/signup',
//     text: 'Зарегистрироваться',
//     open: signupPage,
// },
// login: {
//     href: '/login',
//     text: 'Авторизоваться',
//     open: loginPage,
// },
// profile: {
//     href: '/profile',
//     text: 'Профиль',
//     open: profilePage,
// },
// about: {
//     href: '/about',
//     text: 'Контакты',
// },
// };


function createNavBar() {
    const nav = document.createElement()

}

function mainPage() {
    // application.insertAdjacentHTML('afterend', )


    application.innerHTML = `
        <ul>
            <li><a class="activeGreenButton" href="/">HotelScanner</a></li>
            <li><a href="/top">Лучшие отели</a></li>
            <li><a href="/list">Список отелей</a></li>
            <li class="dropdown" style="float:right"><a href="#about">Регистрация/Авторизация</a>
                <div class="dropdown-content">
                    <a href="/signin">Войти</a>
                    <a href="/signup">Зарегистрироваться</a>
                </div>
            </li>
        </ul>
        `

    // const menuItem = document.createElement('a')
    // menuItem.textContent = 'ahahahh'

    application.appendChild(menuItem)
}

mainPage()
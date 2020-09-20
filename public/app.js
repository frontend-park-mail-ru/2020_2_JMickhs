console.log('i am start!!!')

const application = document.getElementById('app')

function mainPage() {
    application.innerHTML += `
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
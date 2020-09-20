console.log('i am start!!!')

const application = document.getElementById('app')

function mainPage() {
    const menuItem = document.createElement('a')
    menuItem.textContent = 'ahahahh'

    application.appendChild(menuItem)
}

mainPage()
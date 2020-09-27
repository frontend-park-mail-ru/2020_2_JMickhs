// 'use strict'
// import { testHello } from './test/test'

const application = document.getElementById('app');


const ErrorPage = {
    activate: () => {
        return `
        <section>
          <h1>Error</h1>
          <p>This is just a test</p>
        </section>
      `;
    }
}



// function signupPageRender() {
//     application.innerHTML = AuthPage.render()
//     let form = document.getElementById('loginform')
//     let emailInput = document.getElementById('email')
//     let passInput = document.getElementById('password')

//     let btn = document.getElementById('btnAuth')
//     btn.type = 'submit';
//     btn.value = 'Авторизироваться!';
//     form.addEventListener('submit', (evt) => {
//         // evt.preventDefault();
//         // let username = 'serenehet@gmail.com';
//         // let password = '12345678910';
//         // ajax(
//         //     'POST',
//         //     'http://81.163.28.77:8080/api/v1/signup',
//         //     {username, password},
//         //     )
//         evt.preventDefault();
//         let username = 'kek@gmail.com'
//         let password = '123456789012'
//         ajax(
//             'POST',
//             'http://89.208.197.127:8080/api/v1/signup', { username, password },
//             (status, response) => {
//                 console.log(status);
//                 console.log(response);
//             }
//         )
//     });
// }

// const routes = [
//     { path: '/', component: HomePage, },
//     { path: '/list', component: ListPage, },
//     { path: '/signin', component: AuthPage, },
//     { path: '/signup', component: RegPage, },
// ];

const router = new Router();
router.append('/', createHomeContoller());
router.append('/signin', createSigninController());
router.append('/list',  createListController());
router.start();

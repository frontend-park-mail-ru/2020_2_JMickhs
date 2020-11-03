import Router from '@router/router';
import HomeController from '@home/homeController';
import NavbarController from '@navbar/navController';
// import ListController from '@list/listController';
import SigninController from '@sign/signin/signinController';
import SignupController from '@sign/signup/signupController';
import ProfileController from '@profile/profileController';
import HostelPageController from '@hostel/HostelPageController';
import ErrorPageController from '@pageError/errorPageController';
import Events from '@eventBus/eventbus';
import {
    REDIRECT,
    REDIRECT_ERROR,
} from '@eventBus/constants';
import userFromCookie from '@user/cookieUser';

import '@/main.css';

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('../serviceWorker.js', {scope: '/'}).then((reg) => {
//         console.log('Worker registrated!!!');
//     }).catch((err) => {
//         console.log('Worker fucked up:(', err);
//     });
// }

/**
 *  Старт нашего приложения =)
 */
(() => {
    const application = document.getElementById('app');

    const navbarController = new NavbarController(application);

    userFromCookie();

    navbarController.activate();

    const homeController = new HomeController(application);
    // const listController = new ListController(application);
    const signinController = new SigninController(application);
    const signupController = new SignupController(application);
    const profileController = new ProfileController(application);
    const hostelPageController = new HostelPageController(application);
    const errorPageController = new ErrorPageController(application);

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    // Router.append('/list', listController);
    Router.append('/hostel', hostelPageController);

    Router.errorController = errorPageController;
    Router.start();

    Events.subscribe(REDIRECT, (arg) => {
        const {url, data} = arg as {url: string, data: unknown};
        Router.pushState(url, data);
    });
    Events.subscribe(REDIRECT_ERROR, (arg) => {
        const {url, err} = arg as {url: string, err: string};
        Router.pushState(url, err);
    });
})();

import Router from '@router/router';
import HomeController from '@home/homeController';
import NavbarController from '@navbar/navController';
import ListController from '@list/listController';
import SigninController from '@signin/signinController';
import SignupController from '@signup/signupController';
import ProfileController from '@profile/profileController';
import HostelPageController from '@hostel/HostelPageController';
import ErrorPageController from '@pageError/errorPageController';
import Events from '@eventBus/eventbus';
import {
    REDIRECT,
    REDIRECT_ERROR,
} from '@eventBus/constants';
import User from '@user/user';
import getUserFromCookie from '@user/cookieUser';

import '@/main.css';

/**
 *  Старт нашего приложения =)
 */
(() => {
    const application = document.getElementById('app');

    const navbarController = new NavbarController(application);

    const userSingleton = User.getInstance();
    const userDataPromise = getUserFromCookie();
    userDataPromise.then((data) => {
        userSingleton.setData(data);
    });

    navbarController.activate();

    const homeController = new HomeController(application);
    const listController = new ListController(application);
    const signinController = new SigninController(application);
    const signupController = new SignupController(application);
    const profileController = new ProfileController(application);
    const hostelPageController = new HostelPageController(application);
    const errorPageController = new ErrorPageController(application);

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/list', listController);
    Router.append('/hostel', hostelPageController);

    Router.errorController = errorPageController;
    Router.start();

    Events.subscribe(REDIRECT, (arg) => {
        const {url, data} = arg;
        Router.pushState(url, data);
    });
    Events.subscribe(REDIRECT_ERROR, (arg) => {
        const {url, err} = arg;
        Router.pushState(url, err);
    });
})();

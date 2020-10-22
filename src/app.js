import Router from '@router/router';
import HomeController from '@home/homeController';
import NavbarController from '@navbar/navController';
import ListController from '@list/listController';
import SigninController from '@signin/signinController';
import SignupController from '@signup/signupController';
import ProfileController from '@profile/profileController';
import HostelController from '@hostel/hostelController';
import ErrorController from '@pageError/errorController';
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

    const user = getUserFromCookie();
    const userSingleton = User.getInstance();
    userSingleton.setData(user);

    const navbarController = new NavbarController(application);
    navbarController.activate();

    const homeController = new HomeController(application);
    const listController = new ListController(application);
    const signinController = new SigninController(application);
    const signupController = new SignupController(application);
    const profileController = new ProfileController(application);
    const hostelController = new HostelController(application);
    const errorController = new ErrorController(application);

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/list', listController);
    Router.append('/hostel', hostelController);
    Router.errorController = errorController;
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

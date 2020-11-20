import Router from '@router/router';
import HomeController from '@home/home-controller';
import NavbarController from '@navbar/navbar-controller';
import SigninController from '@sign/signin/signin-controller';
import SignupController from '@sign/signup/signup-controller';
import ProfileController from '@profile/profile-controller';
import HostelPageController from '@hostel/hostel-page-controller';
import ErrorPageController from '@/components/page-error/page-error-controller';
import userFromCookie from '@/helpers/user/cookie-user';
import registrateServiceWorker from '@/service-worker/registrate';
import Popup from './components/popup/popup';
import MainFrame from './helpers/layout/main-frame';

import '@/main.css';

((): void => {
    registrateServiceWorker();

    const application = document.getElementById('app');
    const frame = new MainFrame(application);
    const parts = {
        navbar: 'navbar',
        page: 'page',
        popup: 'popup',
    };
    frame.createElements(parts);

    const navbarController = new NavbarController(frame.getElement(parts.navbar));
    navbarController.activate();

    userFromCookie();

    const homeController = new HomeController(frame.getElement(parts.page));
    const signinController = new SigninController(frame.getElement(parts.page));
    const signupController = new SignupController(frame.getElement(parts.page));
    const profileController = new ProfileController(frame.getElement(parts.page));
    const hostelPageController = new HostelPageController(frame.getElement(parts.page));
    const errorPageController = new ErrorPageController(frame.getElement(parts.page));

    Popup.init(frame.getElement(parts.popup));

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/hostel/', hostelPageController);

    Router.errorController = errorPageController;
    Router.start();
})();

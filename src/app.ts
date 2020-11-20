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
    const navbarElementId = 'navbar';
    const pageElementId = 'page';
    const popupElementId = 'popup';

    frame.createElements([navbarElementId, pageElementId, popupElementId]);

    const navbarController = new NavbarController(frame.getElement(navbarElementId));
    navbarController.activate();

    userFromCookie();

    const homeController = new HomeController(frame.getElement(pageElementId));
    const signinController = new SigninController(frame.getElement(pageElementId));
    const signupController = new SignupController(frame.getElement(pageElementId));
    const profileController = new ProfileController(frame.getElement(pageElementId));
    const hostelPageController = new HostelPageController(frame.getElement(pageElementId));
    const errorPageController = new ErrorPageController(frame.getElement(pageElementId));

    Popup.init(frame.getElement(popupElementId));

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/hostel/', hostelPageController);

    Router.errorController = errorPageController;
    Router.start();
})();

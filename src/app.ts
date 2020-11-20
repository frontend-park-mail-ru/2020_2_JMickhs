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
import Popup from '@/components/popup/popup';
import MainFrame from '@/helpers/layout/main-frame';
import { ID_PAGE, ID_NAVBAR, ID_POPUP } from '@/helpers/layout/id-components';

import '@/main.css';

((): void => {
    registrateServiceWorker();

    const application = document.getElementById('app');
    const frame = new MainFrame(application);
    frame.createElements([ID_NAVBAR, ID_PAGE, ID_POPUP]);

    const navbarElement = frame.getElement(ID_NAVBAR);
    const navbarController = new NavbarController(navbarElement);
    navbarController.activate();

    userFromCookie();

    const pageElement = frame.getElement(ID_PAGE);
    const homeController = new HomeController(pageElement);
    const signinController = new SigninController(pageElement);
    const signupController = new SignupController(pageElement);
    const profileController = new ProfileController(pageElement);
    const hostelPageController = new HostelPageController(pageElement);
    const errorPageController = new ErrorPageController(pageElement);

    const popupElement = frame.getElement(ID_POPUP);
    Popup.init(popupElement);

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/hostel/', hostelPageController);

    Router.errorController = errorPageController;
    Router.start();
})();

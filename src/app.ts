import Router from '@router/router';
import HomeController from '@home/home-controller';
import NavbarController from '@navbar/navbar-controller';
import SigninController from '@sign/signin/signin-controller';
import SignupController from '@sign/signup/signup-controller';
import ProfileController from '@profile/profile-controller';
import HostelPageController from '@hostel/hostel-page-controller';
import WishlistController from '@wishlist/wishlist-controller';
import Chat from '@chat/chat';
import ErrorPageController from '@/components/page-error/page-error-controller';
import userFromCookie from '@/helpers/user/cookie-user';
import registrateServiceWorker from '@/service-worker/registrate';
import MessagePopup from '@/components/message-popup/message-popup';
import Popup from '@/components/popup/popup';
import MainFrame from '@/helpers/layout/main-frame';
import {
    ID_PAGE,
    ID_NAVBAR,
    ID_POPUP,
    ID_MESSAGE_POPUP,
} from '@/helpers/layout/id-components';

import '@/main.css';

((): void => {
    registrateServiceWorker();

    const application = document.getElementById('app');
    const frame = new MainFrame(application);
    frame.createElements([ID_NAVBAR, ID_PAGE, ID_POPUP, ID_MESSAGE_POPUP]);

    userFromCookie();

    const navbarElement = frame.getElement(ID_NAVBAR);
    const navbarController = new NavbarController(navbarElement);
    navbarController.activate();

    const pageElement = frame.getElement(ID_PAGE);
    const homeController = new HomeController(pageElement);
    const signinController = new SigninController(pageElement);
    const signupController = new SignupController(pageElement);
    const profileController = new ProfileController(pageElement);
    const hostelPageController = new HostelPageController(pageElement);
    const wishlistController = new WishlistController(pageElement);

    const chatController = new Chat();
    chatController.setPlace(pageElement as HTMLDivElement);

    const errorPageController = new ErrorPageController(pageElement);

    const popupElement = frame.getElement(ID_POPUP);
    Popup.init(popupElement);
    const messagePopupElement = frame.getElement(ID_MESSAGE_POPUP) as HTMLDivElement;
    MessagePopup.init(messagePopupElement);

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/hostel/', hostelPageController);
    Router.append('/wishlist', wishlistController);
    Router.append('/chat', chatController);

    Router.errorController = errorPageController;
    Router.start();
})();

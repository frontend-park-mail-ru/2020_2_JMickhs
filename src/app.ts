import Router from '@router/router';
import HomeController from '@home/home-controller';
import NavbarController from '@navbar/navbar-controller';
import SigninController from '@sign/signin/signin-controller';
import SignupController from '@sign/signup/signup-controller';
import ProfileController from '@profile/profile-controller';
import HostelPageController from '@hostel/hostel-page-controller';
import ErrorPageController from '@/components/page-error/page-error-controller';
import userFromCookie from '@/helpers/user/cookie-user';

import '@/main.css';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => navigator.serviceWorker.ready.then((worker) => {
            worker.sync.register('syncdata');
        }))
        // eslint-disable-next-line no-console
        .catch((err) => console.log(err));
}

((): void => {
    const application = document.getElementById('app');

    const navbarController = new NavbarController(application);

    userFromCookie();

    navbarController.activate();

    const homeController = new HomeController(application);
    const signinController = new SigninController(application);
    const signupController = new SignupController(application);
    const profileController = new ProfileController(application);
    const hostelPageController = new HostelPageController(application);
    const errorPageController = new ErrorPageController(application);

    Router.append('/', homeController);
    Router.append('/signin', signinController);
    Router.append('/signup', signupController);
    Router.append('/profile', profileController);
    Router.append('/hostel', hostelPageController);

    Router.errorController = errorPageController;
    Router.start();
})();

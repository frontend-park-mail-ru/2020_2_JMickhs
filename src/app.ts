import Router from '@router/router';
import HomeController from '@home/homeController';
import NavbarController from '@/components/navbar/navbarController';
import SigninController from '@sign/signin/signinController';
import SignupController from '@sign/signup/signupController';
import ProfileController from '@profile/profileController';
import HostelPageController from '@hostel/HostelPageController';
import ErrorPageController from '@/components/pageError/pageErrorController';
import userFromCookie from '@user/cookieUser';

import '@/main.css';

if ('serviceWorker' in navigator) {
    // Весь код регистрации у нас асинхронный.
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

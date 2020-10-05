import Router from './helpers/router/router';
import EventBus from './helpers/eventbus/eventbus';
import HomeController from './components/home/homeController';
import NavbarController from './components/navbar/navbarController';
import ListController from './components/list/listController';
import SigninController from './components/signin/signinController';
import SignupController from './components/signup/signupController';
import ProfileController from './components/profile/profileController';
import ProfileModel from './components/profile/profileModel';

// старт нашего приложения
(function main() {
    globalThis.EventBus = new EventBus();

    const application = document.getElementById('app');

    const userModel = ProfileModel.instance;
    userModel.getCurrUser();

    const navbarController = new NavbarController(application);
    navbarController.activate();

    const homeController = new HomeController(application);
    const listController = new ListController(application);
    const signinController = new SigninController(application);
    const signupController = new SignupController(application);
    const profileController = new ProfileController(application);

    globalThis.router = new Router();
    router.append('/', homeController);
    router.append('/signin', signinController);
    router.append('/signup', signupController);
    router.append('/profile', profileController);
    router.append('/list', listController);
    router.start();
}());


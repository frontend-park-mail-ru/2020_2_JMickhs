import Router from './helpers/router/router';
import EventBus from './helpers/eventbus/eventbus';
import HomeController from './components/home/homeController';
import UserModel from './components/profile/usermodel';
import NavbarController from './components/navbar/navbarController';
import ListController from './components/list/listController';
import SigninController from './components/signin/signinController';
import SignupController from './components/signup/signupController';
import ProfileController from './components/profile/profileController';

// старт нашего приложения
(function main() {
    globalThis.EventBus = new EventBus();

    const application = document.getElementById('app');

    const userModel = new UserModel();
    userModel.getCurrUser();

    const navbarController = new NavbarController(application, userModel);
    navbarController.activate();

    const homeController = new HomeController(application);
    const listController = new ListController(application);
    const signinController = new SigninController(application, userModel);
    const signupController = new SignupController(application, userModel);
    const profileController = new ProfileController(application, userModel);

    const router = new Router();
    router.append('/', homeController);
    router.append('/signin', signinController);
    router.append('/signup', signupController);
    router.append('/profile', profileController);
    router.append('/list', listController);
    router.start();
}());


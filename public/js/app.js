import Router from './helpers/router/router';
import HomeController from './components/home/homeController';
import NavbarController from './components/navbar/navbarController';
import ListController from './components/list/listController';
import SigninController from './components/signin/signinController';
import SignupController from './components/signup/signupController';
import ProfileController from './components/profile/profileController';
import ProfileModel from './components/profile/profileModel';
import HostelController from './components/hostel/hostelController';
import Events from './helpers/eventbus/eventbus';

/**
 *  Старт нашего приложения =)
 */
(() => {
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
  const hostelController = new HostelController(application);

  Router.append('/', homeController);
  Router.append('/signin', signinController);
  Router.append('/signup', signupController);
  Router.append('/profile', profileController);
  Router.append('/list', listController);
  Router.append('/hostel', hostelController);
  Router.start();
  Events.subscribe('redirect', (arg) => {
    const {url} = arg;
    Router.pushState(url);
  });
})();


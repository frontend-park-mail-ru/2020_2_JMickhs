import Router from './helpers/router/router'
import { HomeController } from './components/home/home'
import { NavbarController, NavbarView, NavbarModel } from './components/navbar/navbar'
import { SigninController, SigninView, SigninModel } from './components/signin/signin'

let application = document.getElementById('app');

const navbarModel = new NavbarModel();
const navbarView = new NavbarView(application, navbarModel);
const navbarController = new NavbarController(navbarView, navbarModel);
navbarController.activate();

const homeController = new HomeController(navbarView.navbar);

const signinModel = new SigninModel();
const signinView = new SigninView(navbarView.navbar, signinModel);
const signinController = new SigninController(signinView, signinModel);

const router = new Router();
router.append('/', homeController);
router.append('/signin', signinController);
router.start();
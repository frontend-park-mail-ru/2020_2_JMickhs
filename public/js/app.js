import Router from './helpers/router/router'
import { HomeController } from './components/home/home'
import { NavbarController, NavbarView, NavbarModel } from './components/navbar/navbar'
import { SigninController, SigninView, SigninModel } from './components/signin/signin'
import UserModel from './components/usermodel/usermodel'

let application = document.getElementById('app');

const userModel = new UserModel();

userModel.cookieUser();

const navbarModel = new NavbarModel(userModel);
const navbarView = new NavbarView(application, navbarModel);
const navbarController = new NavbarController(navbarView, navbarModel);
navbarController.activate();

const homeController = new HomeController(application);

const signinModel = new SigninModel(userModel);
const signinView = new SigninView(application, signinModel);
const signinController = new SigninController(signinView, signinModel);

const router = new Router();
router.append('/', homeController);
router.append('/signin', signinController);
router.start();
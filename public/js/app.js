import Router from './helpers/router/router'
import { HomeController } from './components/home/home'
import { NavbarController, NavbarView, NavbarModel } from './components/navbar/navbar'
import { SigninController, SigninView, SigninModel } from './components/signin/signin'
import { SignupController, SignupView, SignupModel } from './components/signup/signup'
import UserModel from './components/usermodel/usermodel'
import { LisController, ListView, ListModel } from './components/list/list'

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

const signupModel = new SignupModel(userModel);
const signupView = new SignupView(application, signupModel);
const signupController = new SignupController(signupView, signupModel);

const listModel = new ListModel();
const listView = new ListView(application, listModel);
const lisController = new LisController(listView, listModel);

const router = new Router();
router.append('/', homeController);
router.append('/signin', signinController);
router.append('/signup', signupController);
router.append('/list', lisController);
router.start();
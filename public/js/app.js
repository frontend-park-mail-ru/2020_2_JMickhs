import Router from './helpers/router/router'
import { HomeController, HomeView } from './components/home/home'
import { NavbarController, NavbarView, NavbarModel } from './components/navbar/navbar'
import { SigninController, SigninView, SigninModel } from './components/signin/signin'
import { SignupController, SignupView, SignupModel } from './components/signup/signup'
import { ProfileController, ProfileView } from './components/profile/profile'
import UserModel from './components/profile/usermodel'
import { ListController, ListView, ListModel } from './components/list/list'

const application = document.getElementById('app');

const userModel = new UserModel();

userModel.cookieUser();

const navbarModel = new NavbarModel(userModel);
const navbarView = new NavbarView(application, navbarModel);
const navbarController = new NavbarController(navbarView, navbarModel);
navbarController.activate();

const homeView = new HomeView(application);
const homeController = new HomeController(homeView)

const signinModel = new SigninModel(userModel);
const signinView = new SigninView(application, signinModel);
const signinController = new SigninController(signinView, signinModel);

const signupModel = new SignupModel(userModel);
const signupView = new SignupView(application, signupModel);
const signupController = new SignupController(signupView, signupModel);

const profileView = new ProfileView(application, userModel);
const profileController = new ProfileController(profileView, userModel);

const listModel = new ListModel();
const listView = new ListView(application, listModel);
const listController = new ListController(listView, listModel);

const router = new Router();
router.append('/', homeController);
router.append('/signin', signinController);
router.append('/signup', signupController);
router.append('/profile', profileController);
router.append('/list', listController);
router.start();
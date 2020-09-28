import Navbar from './js/navbar/navbar'
import UserModel from './js/usermodel/usermodel'
import { SigninView, SigninController } from './js/signin/signin'
import { SignupView, SignupController } from './js/signup/signup'
import { HomeView, HomeController } from './js/home/home'
import { ProfileView, ProfileController } from './js/profile/profile'
import Router from './js/router'
import createListController from './js/list/list'

const navbar = new Navbar();

const userModel = new UserModel();

userModel.cookieUser();

const signinView = new SigninView(userModel, { navbar: navbar });
const signupView = new SignupView(userModel, { navbar: navbar });
const homeView = new HomeView({ navbar: navbar });
const profileView = new ProfileView(userModel, { navbar: navbar })

const signinController = new SigninController(signinView, userModel);
const signupController = new SignupController(signupView, userModel);
const profileController = new ProfileController(profileView, userModel);
const homeController = new HomeController(homeView);


const router = new Router();
router.append('/', homeController);
router.append('/signin', signinController);
router.append('/signup', signupController);
router.append('/profile', profileController);
router.append('/list', createListController())
router.start();
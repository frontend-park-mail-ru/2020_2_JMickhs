import Navbar from './js/components/navbar/navbar'
import UserModel from './js/components/usermodel/usermodel'
import { SigninView, SigninController } from './js/components/pages/signin/signin'
import { SignupView, SignupController } from './js/components/pages/signup/signup'
import { HomeView, HomeController } from './js/components/pages/home/home'
import { ProfileView, ProfileController } from './js/components/pages/profile/profile'
import Router from './js/helpers/router/router'
import createListController from './js/components/pages/list/list'

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
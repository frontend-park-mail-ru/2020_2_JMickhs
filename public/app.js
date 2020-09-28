console.log('hello, i am started');

const application = document.getElementById('app');

const ErrorPage = {
    activate: () => {
        return `
        <section>
          <h1>Error</h1>
          <p>This is just a test</p>
        </section>
      `;
    }
}

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
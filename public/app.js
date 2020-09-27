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

const userModel = new UserModel();

const signinView = new SigninView(userModel);
const signupView = new SignupView(userModel);

const signinController = new SigninController(signinView, userModel);
const signupController = new SignupController(signupView, userModel);

const router = new Router();
router.append('/', createHomeContoller());
router.append('/signin', signinController);
router.append('/signup', signupController);
router.start();
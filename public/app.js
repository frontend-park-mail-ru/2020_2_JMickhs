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

const router = new Router();
router.append('/', createHomeContoller());
router.append('/signin', createSigninController());
router.append('/signup', createSignUpController());
router.start();
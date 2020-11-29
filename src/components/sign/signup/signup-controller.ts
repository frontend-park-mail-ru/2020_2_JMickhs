import SignupModel from '@sign/signup/signup-model';
import SignupView from '@sign/signup/signup-view';
import Events from '@eventbus/eventbus';
import {
    PAGE_SIGNUP,
    SUBMIT_SIGNUP,
    AUTH_USER,
} from '@eventbus/constants';
import {
    INPUT_LOGIN,
    INPUTS_PASWORDS,
    INPUT_EMAIL,
} from '@sign/constants/input-names';
import Validator from '@/helpers/validator/validator';
import Redirector from '@router/redirector';

/** Класс контроллера для страницы регистрации */
export default class SignupController {
    private model: SignupModel;

    private view: SignupView;

    constructor(place: HTMLElement) {
        this.model = new SignupModel();
        this.view = new SignupView(place);
    }

    activate(): void {
        this.subscribeEvents();
        Events.trigger(PAGE_SIGNUP);
        if (this.model.isAuth()) {
            this.redirectToProfile();
            return;
        }
        this.view.render();
    }

    private redirectToProfile(): void {
        Redirector.redirectTo('/profile');
    }

    private subscribeEvents(): void {
        Events.subscribe(SUBMIT_SIGNUP, this.validate);
        Events.subscribe(AUTH_USER, this.redirectToProfile);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SUBMIT_SIGNUP, this.validate);
        Events.unsubscribe(AUTH_USER, this.redirectToProfile);
    }

    private validate = (arg: {login: string, email: string, passwordFirst: string, passwordSecond: string}): void => {
        const {
            login,
            email,
            passwordFirst,
            passwordSecond,
        } = arg;

        let resolution = true;

        if (login === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', INPUT_LOGIN);
        }
        if (email === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', INPUT_EMAIL);
        }
        if (passwordFirst === '' || passwordSecond === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', INPUTS_PASWORDS);
        }

        if (passwordFirst !== passwordSecond) {
            resolution = false;
            this.view.renderError('Пароли не совпадают', INPUTS_PASWORDS);
        }

        if (!resolution) {
            return;
        }

        const loginErrors = Validator.validateLogin(login);
        if (loginErrors.length > 0) {
            resolution = false;
            this.view.renderError(loginErrors[0], INPUT_LOGIN);
        }

        const emailErrors = Validator.validateEmail(email);
        if (emailErrors.length > 0) {
            resolution = false;
            this.view.renderError(emailErrors[0], INPUT_EMAIL);
        }

        const passwordErrors = Validator.validatePassword(passwordFirst);
        if (passwordErrors.length > 0) {
            resolution = false;
            this.view.renderError(passwordErrors[0], INPUTS_PASWORDS);
        }

        if (resolution) {
            this.model.signup(login, email, passwordSecond);
        }
    };

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }
}

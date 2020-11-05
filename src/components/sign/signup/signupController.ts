import SignupModel from '@sign/signup/signupModel';
import SignupView from '@sign/signup/signupView';
import Events from '@eventBus/eventbus';
import {
    PAGE_SIGNUP,
    SUBMIT_SIGNUP,
    AUTH_USER,
} from '@eventBus/constants';
import Validator from '@/helpers/validator/validator';
import Redirector from '@router/redirector';
import { HandlerEvent } from '@/helpers/interfaces/functions';

/** Класс контроллера для страницы регистрации */
export default class SignupController {
    private model: SignupModel;

    private view: SignupView;

    private handlers: Record<string, HandlerEvent>;

    constructor(parent: HTMLElement) {
        this.model = new SignupModel();
        this.view = new SignupView(parent);

        this.handlers = this.makeHandlers();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            validate: this.validate.bind(this),
        };
    }

    activate(): void {
        if (this.model.isAuth()) {
            this.redirectToProfile();
            return;
        }
        this.subscribeEvents();
        Events.trigger(PAGE_SIGNUP);
        this.view.render();
    }

    private redirectToProfile(): void {
        Redirector.redirectTo('/profile');
    }

    private subscribeEvents(): void {
        Events.subscribe(SUBMIT_SIGNUP, this.handlers.validate);
        Events.subscribe(AUTH_USER, this.redirectToProfile);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SUBMIT_SIGNUP, this.handlers.validate);
        Events.unsubscribe(AUTH_USER, this.redirectToProfile);
    }

    private validate(arg: {login: string, email: string, passwordFirst: string, passwordSecond: string}): void {
        const {
            login,
            email,
            passwordFirst,
            passwordSecond,
        } = arg;

        let resolution = true;

        if (login === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', 1);
        }
        if (email === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', 2);
        }
        if (passwordFirst === '' || passwordSecond === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', 3);
        }

        if (passwordFirst !== passwordSecond) {
            resolution = false;
            this.view.renderError('Пароли не совпадают', 3);
        }

        if (!resolution) {
            return;
        }

        const loginErrors = Validator.validateLogin(login);
        if (loginErrors.length > 0) {
            resolution = false;
            this.view.renderError(loginErrors[0], 1);
        }

        const emailErrors = Validator.validateEmail(email);
        if (emailErrors.length > 0) {
            resolution = false;
            this.view.renderError(emailErrors[0], 2);
        }

        const passwordErrors = Validator.validatePassword(passwordFirst);
        if (passwordErrors.length > 0) {
            resolution = false;
            this.view.renderError(passwordErrors[0], 3);
        }

        if (resolution) {
            this.model.signup(login, email, passwordSecond);
        }
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }
}

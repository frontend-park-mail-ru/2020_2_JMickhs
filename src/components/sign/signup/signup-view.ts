import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import {
    ERROR_SIGNUP,
    SUBMIT_SIGNUP,
    SIGNUP_USER,
} from '@eventbus/constants';

import * as signupTemplate from '@sign/templates/signup.hbs';
import * as promtTemplate from '@sign/templates/signup-promt.hbs';
import '@sign/templates/sign.css';
import Redirector from '@router/redirector';
import Validator from '@/helpers/validator/validator';
import type { HandlerEvent } from '@interfaces/functions';

/** Класс представления для страницы регистрации */
export default class SignupView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private timerId: number;

    private form?: HTMLFormElement;

    private loginInput?: HTMLInputElement;

    private emailInput?: HTMLInputElement;

    private passwordInputFirst?: HTMLInputElement;

    private passwordInputSecond?: HTMLInputElement;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHandlers();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            userSignup: (user): void => {
                if (user) {
                    Redirector.redirectTo('/profile');
                } else {
                    Events.trigger(ERROR_SIGNUP, 'Вы не смогли зарегистрироваться =)');
                }
            },
            errorSignup: (err: string): void => {
                this.renderError(err);
            },
            clickLoginInput: (): void => {
                this.clickInput('login');
            },
            clickPassInput: (): void => {
                this.clickInput('password');
            },
            clickInput: (): void => {
                this.clickInput();
            },
            submitSignupForm: this.submitSignup.bind(this),
        };
    }

    render(): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = signupTemplate();

        this.form = document.getElementById('signupform') as HTMLFormElement;
        this.loginInput = document.getElementById('signup-login') as HTMLInputElement;
        this.emailInput = document.getElementById('signup-email') as HTMLInputElement;
        this.passwordInputFirst = document.getElementById('signup-password1') as HTMLInputElement;
        this.passwordInputSecond = document.getElementById('signup-password2') as HTMLInputElement;

        this.subscribeEvents();
    }

    private subscribeEvents(): void {
        Events.subscribe(ERROR_SIGNUP, this.handlers.errorSignup);
        Events.subscribe(SIGNUP_USER, this.handlers.userSignup);

        this.form.addEventListener('submit', this.handlers.submitSignupForm);
        this.loginInput.addEventListener('click', this.handlers.clickLoginInput);
        this.emailInput.addEventListener('click', this.handlers.clickInput);
        this.passwordInputFirst.addEventListener('click', this.handlers.clickPassInput);
        this.passwordInputSecond.addEventListener('click', this.handlers.clickPassInput);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(ERROR_SIGNUP, this.handlers.errorSignup);
        Events.unsubscribe(SIGNUP_USER, this.handlers.userSignup);

        if (this.form) {
            this.form.removeEventListener('submit', this.handlers.submitSignupForm);
            this.loginInput.removeEventListener('click', this.handlers.clickLoginInput);
            this.emailInput.removeEventListener('click', this.handlers.clickInput);
            this.passwordInputFirst.removeEventListener('click', this.handlers.clickPassInput);
            this.passwordInputSecond.removeEventListener('click', this.handlers.clickPassInput);
        }
    }

    renderError(err: string, numberInputErr = 0): void {
        if (this.timerId !== -1) {
            window.clearTimeout(this.timerId);
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = err;

        switch (numberInputErr) {
            case 1: {
                this.loginInput.className += ' sign__input--error';
                break;
            }
            case 2: {
                this.emailInput.className += ' sign__input--error';
                break;
            }
            case 3: {
                this.passwordInputFirst.className += ' sign__input--error';
                this.passwordInputSecond.className += ' sign__input--error';
                break;
            }
            default: {
                break;
            }
        }

        this.timerId = window.setTimeout(() => {
            errLine.textContent = '';
            if (this.loginInput) {
                this.loginInput.className = 'sign__input';
                this.emailInput.className = 'sign__input';
                this.passwordInputFirst.className = 'sign__input';
                this.passwordInputSecond.className = 'sign__input';
            }
            this.timerId = -1;
        }, 5000);
    }

    private clickInput(inputName?: string): void {
        let promts: string[] = [];
        switch (inputName) {
            case 'login': {
                promts = Validator.loginRules();
                break;
            }
            case 'password': {
                promts = Validator.passwordRules();
                break;
            }
            default: {
                break;
            }
        }

        document.getElementById('password-promts').innerHTML = '';
        document.getElementById('login-promts').innerHTML = '';

        const promtsDiv = document.getElementById(`${inputName}-promts`);
        if (!promtsDiv) {
            return;
        }
        promtsDiv.innerHTML = promtTemplate({ promts });
    }

    private submitSignup(event: Event): void {
        event.preventDefault();
        const loginInput = document.getElementById('signup-login');
        const emailInput = document.getElementById('signup-email');
        const passInput1 = document.getElementById('signup-password1');
        const passInput2 = document.getElementById('signup-password2');

        const login = this.loginInput.value;
        const email = this.emailInput.value;
        const passwordFirst = this.passwordInputFirst.value;
        const passwordSecond = this.passwordInputSecond.value;

        loginInput.className = 'sign__input';
        emailInput.className = 'sign__input';
        passInput1.className = 'sign__input';
        passInput2.className = 'sign__input';

        Events.trigger(SUBMIT_SIGNUP, {
            login, email, passwordFirst, passwordSecond,
        });
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }
        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }
}

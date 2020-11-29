import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import {
    ERROR_SIGNUP,
    SUBMIT_SIGNUP,
    SIGNUP_USER,
} from '@eventbus/constants';
import {
    INPUT_LOGIN,
    INPUTS_PASWORDS,
    INPUT_EMAIL,
} from '@sign/constants/input-names';

import * as signupTemplate from '@sign/templates/signup.hbs';
import * as promtTemplate from '@sign/templates/signup-promt.hbs';
import '@sign/templates/sign.css';
import Redirector from '@router/redirector';
import Validator from '@/helpers/validator/validator';
import type { UserData } from '@interfaces/structs-data/user-data';

/** Класс представления для страницы регистрации */
export default class SignupView extends PageView {
    private timerId: number;

    private form: HTMLFormElement;

    private loginInput: HTMLInputElement;

    private emailInput: HTMLInputElement;

    private passwordInputFirst: HTMLInputElement;

    private passwordInputSecond: HTMLInputElement;

    private signupButton: HTMLButtonElement;

    private userSignup = (user: UserData): void => {
        this.signupButton.disabled = false;
        if (user) {
            Redirector.redirectTo('/profile');
        } else {
            Events.trigger(ERROR_SIGNUP, 'Вы не смогли зарегистрироваться =)');
        }
    };

    private errorSignup = (err: string): void => {
        this.renderError(err);
    };

    private clickLoginInput = (): void => {
        this.clickInput(INPUT_LOGIN);
    };

    private clickPassInput = (): void => {
        this.clickInput(INPUTS_PASWORDS);
    };

    private cliclUnknowInput = (): void => {
        this.clickInput();
    };

    render(): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = signupTemplate();

        this.form = document.getElementById('signupform') as HTMLFormElement;
        this.loginInput = document.getElementById('signup-login') as HTMLInputElement;
        this.emailInput = document.getElementById('signup-email') as HTMLInputElement;
        this.passwordInputFirst = document.getElementById('signup-password1') as HTMLInputElement;
        this.passwordInputSecond = document.getElementById('signup-password2') as HTMLInputElement;
        this.signupButton = document.getElementById('signup-button') as HTMLButtonElement;

        this.subscribeEvents();
    }

    private subscribeEvents(): void {
        Events.subscribe(ERROR_SIGNUP, this.errorSignup);
        Events.subscribe(SIGNUP_USER, this.userSignup);

        this.form.addEventListener('submit', this.submitSignup);
        this.loginInput.addEventListener('click', this.clickLoginInput);
        this.emailInput.addEventListener('click', this.cliclUnknowInput);
        this.passwordInputFirst.addEventListener('click', this.clickPassInput);
        this.passwordInputSecond.addEventListener('click', this.clickPassInput);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(ERROR_SIGNUP, this.errorSignup);
        Events.unsubscribe(SIGNUP_USER, this.userSignup);

        this.form.removeEventListener('submit', this.submitSignup);
        this.loginInput.removeEventListener('click', this.clickLoginInput);
        this.emailInput.removeEventListener('click', this.cliclUnknowInput);
        this.passwordInputFirst.removeEventListener('click', this.clickPassInput);
        this.passwordInputSecond.removeEventListener('click', this.clickPassInput);
    }

    renderError(err: string, nameInput?: string): void {
        this.signupButton.disabled = false;
        if (this.timerId !== -1) {
            window.clearTimeout(this.timerId);
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = err;

        switch (nameInput) {
            case INPUT_LOGIN: {
                this.loginInput.classList.add('sign__input--error');
                break;
            }
            case INPUT_EMAIL: {
                this.emailInput.classList.add('sign__input--error');
                break;
            }
            case INPUTS_PASWORDS: {
                this.passwordInputFirst.classList.add('sign__input--error');
                this.passwordInputSecond.classList.add('sign__input--error');
                break;
            }
            default: {
                break;
            }
        }

        this.timerId = window.setTimeout(() => {
            errLine.textContent = '';
            if (this.loginInput) {
                this.clearErrorInputs();
            }
            this.timerId = -1;
        }, 5000);
    }

    private clickInput(inputName?: string): void {
        let promts: string[] = [];
        switch (inputName) {
            case INPUT_LOGIN: {
                promts = Validator.loginRules();
                break;
            }
            case INPUTS_PASWORDS: {
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

    private submitSignup = (event: Event): void => {
        event.preventDefault();

        const login = this.loginInput.value;
        const email = this.emailInput.value;
        const passwordFirst = this.passwordInputFirst.value;
        const passwordSecond = this.passwordInputSecond.value;

        this.signupButton.disabled = true;
        this.clearErrorInputs();

        Events.trigger(SUBMIT_SIGNUP, {
            login, email, passwordFirst, passwordSecond,
        });
    };

    private clearErrorInputs(): void {
        this.loginInput.classList.remove('sign__input--error');
        this.emailInput.classList.remove('sign__input--error');
        this.passwordInputFirst.classList.remove('sign__input--error');
        this.passwordInputSecond.classList.remove('sign__input--error');
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }
        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }
}

import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import {
    SUBMIT_SIGNIN,
    ERROR_SIGNIN,
    SIGNIN_USER,
} from '@eventbus/constants';
import {
    INPUT_LOGIN,
    INPUTS_PASWORDS,
} from '@sign/constants/input-names';

import * as signinTemplate from '@sign/templates/signin.hbs';
import '@sign/templates/sign.css';
import type { UserData } from '@interfaces/structs-data/user-data';
import Redirector from '@router/redirector';

export default class SigninView extends PageView {
    private timerId: number;

    private form: HTMLFormElement;

    private loginInput: HTMLInputElement;

    private passwordInput: HTMLInputElement;

    private signButton: HTMLButtonElement;

    private signinUser = (user: UserData): void => {
        this.signButton.disabled = false;
        if (user) {
            Redirector.redirectBack();
        } else {
            Events.trigger(ERROR_SIGNIN, 'Неверный логин или пароль!');
        }
    };

    private errorSignin = (error: string): void => {
        this.renderError(error);
    };

    private submitSigninForm = (evt: Event): void => {
        evt.preventDefault();

        const login = this.loginInput.value;
        const password = this.passwordInput.value;
        this.loginInput.classList.remove('sign__input--error');
        this.passwordInput.classList.remove('sign__input--error');
        this.signButton.disabled = true;
        Events.trigger(SUBMIT_SIGNIN, { login, password });
    };

    renderError(errstr: string, nameInput?: string): void {
        this.signButton.disabled = false;
        if (this.timerId !== -1) {
            clearTimeout(this.timerId);
        }
        if (nameInput === INPUT_LOGIN) {
            this.loginInput.classList.add('sign__input--error');
        }
        if (nameInput === INPUTS_PASWORDS) {
            this.passwordInput.classList.add('sign__input--error');
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = errstr;

        this.timerId = window.setTimeout(() => {
            errLine.textContent = '';
            this.loginInput.classList.remove('sign__input--error');
            this.passwordInput.classList.remove('sign__input--error');
            this.timerId = -1;
        }, 5000);
    }

    render(): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = signinTemplate();

        this.form = document.getElementById('signinform') as HTMLFormElement;

        this.loginInput = document.getElementById('signin-login') as HTMLInputElement;
        this.passwordInput = document.getElementById('signin-password') as HTMLInputElement;
        this.signButton = document.getElementById('signin-button') as HTMLButtonElement;

        this.subscribeEvents();
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }

        this.unsubscribeEvents();
        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(ERROR_SIGNIN, this.errorSignin);
        Events.subscribe(SIGNIN_USER, this.signinUser);

        this.form.addEventListener('submit', this.submitSigninForm);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(ERROR_SIGNIN, this.errorSignin);
        Events.unsubscribe(SIGNIN_USER, this.signinUser);

        this.form.removeEventListener('submit', this.submitSigninForm);
    }
}

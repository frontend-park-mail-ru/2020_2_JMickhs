import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import {
    SUBMIT_SIGNIN,
    ERROR_SIGNIN,
    SIGNIN_USER,
} from '@eventbus/constants';

import * as signinTemplate from '@sign/templates/signin.hbs';
import '@sign/templates/sign.css';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';
import Redirector from '@router/redirector';
import type { HandlerEvent } from '@interfaces/functions';

export default class SigninView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private timerId: number;

    private form?: HTMLFormElement;

    private loginInput?: HTMLInputElement;

    private passwordInput?: HTMLInputElement;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        return {
            signinUser: (user: UserData): void => {
                if (user) {
                    Redirector.redirectBack();
                } else {
                    Events.trigger(ERROR_SIGNIN, 'Неверный логин или пароль!');
                }
            },
            renderErr: this.renderError.bind(this),
            submitSigninForm: (evt: Event): void => {
                evt.preventDefault();
                const loginInput = document.getElementById('signin-login') as HTMLInputElement;
                const passInput = document.getElementById('signin-password') as HTMLInputElement;
                const login = loginInput.value;
                const password = passInput.value;
                this.loginInput.classList.remove('sign__input--error');
                this.passwordInput.classList.remove('sign__input--error');
                Events.trigger(SUBMIT_SIGNIN, { login, password });
            },
        };
    }

    renderError(errstr: string, numberInputErr = 0): void {
        if (this.timerId !== -1) {
            clearTimeout(this.timerId);
        }
        if (numberInputErr === 1) {
            this.loginInput.classList.add('sign__input--error');
        }
        if (numberInputErr === 2) {
            this.passwordInput.classList.add('sign__input--error');
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = errstr;

        this.timerId = window.setTimeout(() => {
            errLine.textContent = '';
            this.loginInput?.classList.remove('sign__input--error');
            this.passwordInput?.classList.remove('sign__input--error');
            this.timerId = -1;
        }, 5000);
    }

    render(): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = signinTemplate();

        this.form = document.getElementById('signinform') as HTMLFormElement;

        this.loginInput = document.getElementById('signin-login') as HTMLInputElement;
        this.passwordInput = document.getElementById('signin-password') as HTMLInputElement;

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
        Events.subscribe(ERROR_SIGNIN, this.handlers.renderErr);
        Events.subscribe(SIGNIN_USER, this.handlers.signinUser);

        this.form.addEventListener('submit', this.handlers.submitSigninForm);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(ERROR_SIGNIN, this.handlers.renderErr);
        Events.unsubscribe(SIGNIN_USER, this.handlers.signinUser);

        if (this.form) {
            this.form.removeEventListener('submit', this.handlers.submitSigninForm);
        }
    }
}

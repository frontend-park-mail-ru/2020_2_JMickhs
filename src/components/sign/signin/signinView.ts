import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {
    SUBMIT_SIGNIN,
    ERROR_SIGNIN,
    SIGNIN_USER,
} from '@eventBus/constants';

import * as signinTemplate from '@sign/templates/signin.hbs';
import { UserData } from '@interfaces/structsData/userData';
import Redirector from '@router/redirector';
import { HandlerEvent } from '@interfaces/functions';

export default class SigninView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private timerId: number;

    private form?: HTMLFormElement;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHadlers();
    }

    private makeHadlers(): Record<string, HandlerEvent> {
        return {
            signinUser: (user: UserData) => {
                if (user) {
                    Redirector.redirectBack();
                } else {
                    Events.trigger(ERROR_SIGNIN, 'Неверный логин или пароль!');
                }
            },
            renderErr: this.renderError.bind(this),
            submitSigninForm: (evt: Event) => {
                evt.preventDefault();
                const loginInput = document.getElementById('signin-login') as HTMLInputElement;
                const passInput = document.getElementById('signin-password') as HTMLInputElement;
                const login = loginInput.value;
                const password = passInput.value;
                document.getElementById('signin-login').className = 'sign__input';
                document.getElementById('signin-password').className = 'sign__input';
                Events.trigger(SUBMIT_SIGNIN, { login, password });
            },
        };
    }

    renderError(errstr: string, numberInputErr = 0): void {
        if (this.timerId !== -1) {
            clearTimeout(this.timerId);
        }
        if (numberInputErr === 1) {
            document.getElementById('signin-login').className += ' sign__input--error';
        }
        if (numberInputErr === 2) {
            document.getElementById('signin-password').className += ' sign__input--error';
        }
        const errLine = document.getElementById('text-error');
        errLine.textContent = errstr;

        this.timerId = window.setTimeout(() => {
            errLine.textContent = '';
            const loginElem = document.getElementById('signin-login');
            // тут не очевидно, так что поясню.
            // Если отрендерится ошибка и пользователь перейдет на другую страницу до того как эта ошибка пропадет,
            // выполнится следующий код, но уже на новой странице, на которой нет html-тегов,
            // котрые используются функцией. Бах, и jserror в консоль! Но мы это предвидим :) и проверяем, есть ли
            // нужные теги(одного достаточно на самом деле) на странице
            if (loginElem !== null) {
                loginElem.className = 'sign__input';
                document.getElementById('signin-password').className = 'sign__input';
            }
            this.timerId = -1;
        }, 5000);
    }

    render(): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = signinTemplate();

        this.form = document.getElementById('signinform') as HTMLFormElement;

        this.subscribeEvents();
    }

    hide(): void {
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

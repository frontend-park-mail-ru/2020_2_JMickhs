import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {
    ERROR_SIGNUP,
    SUBMIT_SIGNUP,
    SIGNUP_USER,
} from '@eventBus/constants';

import * as signupTemplate from '@sign/templates/signup.hbs';
import * as promtTemplate from '@sign/templates/signupPromt.hbs';
import Redirector from '@router/redirector';
import { HandlerEvent } from '@interfaces/functions';

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
            userSignup: (user) => {
                if (user) {
                    Redirector.redirectTo('/profile');
                } else {
                    Events.trigger(ERROR_SIGNUP, 'Вы не смогли зарегистрироваться =)');
                }
            },
            errorSignup: (err: string) => {
                this.renderError(err);
            },
            clickLoginInput: () => {
                this.clickInput('login');
            },
            clickPassInput: () => {
                this.clickInput('password');
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
        this.passwordInputFirst.addEventListener('click', this.handlers.clickPassInput);
        this.passwordInputSecond.addEventListener('click', this.handlers.clickPassInput);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(ERROR_SIGNUP, this.handlers.errorSignup);
        Events.unsubscribe(SIGNUP_USER, this.handlers.userSignup);

        if (this.form) {
            this.form.removeEventListener('submit', this.handlers.submitSignupForm);
            this.loginInput.addEventListener('click', this.handlers.clickLoginInput);
            this.passwordInputFirst.addEventListener('click', this.handlers.clickPassInput);
            this.passwordInputSecond.addEventListener('click', this.handlers.clickPassInput);
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

    private clickInput(what?: string): void {
        let input: HTMLInputElement;
        const promts = [];
        switch (what) {
            case 'login': {
                input = this.loginInput;
                promts.push({ text: 'Логин может включать только буквы, цифры и символы _ - .' });
                promts.push({ text: 'Длина логина должна быть в пределе от 3 до 15 символов' });
                break;
            }
            case 'password': {
                input = this.passwordInputFirst;
                promts.push({ text: 'Пароль может включать только буквы английского алфавита и цифры' });
                promts.push({ text: 'Длина пароля должна быть в пределах от 5 до 30 символов' });
                break;
            }
            default: {
                break;
            }
        }
        const promtDivOld = document.getElementById('sign-promt');
        if (promtDivOld) {
            this.form.removeChild(promtDivOld);
        }

        const promtDiv = document.createElement('div');
        promtDiv.id = 'sign-promt';
        promtDiv.innerHTML = promtTemplate(promts);
        this.form.insertBefore(promtDiv, input);
    }

    private submitSignup(event: Event) {
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
        this.unsubscribeEvents();

        this.page.innerHTML = '';
    }
}

import NetworkUser from '@/helpers/network/network-user';
import User from '@/helpers/user/user';
import Validator from '@/helpers/validator/validator';
import type { AbstractComponent } from '@interfaces/components';

import Events from '@eventbus/eventbus';
import {
    CHANGE_USER_OK,
} from '@eventbus/constants';

import * as template from '@profile/settings-data/settings-data.hbs';
import Redirector from '@router/redirector';
import type { HandlerEvent } from '@/helpers/interfaces/functions';

export default class DataUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private saveButton: HTMLButtonElement;

    private loginInput: HTMLInputElement;

    private emailInput: HTMLInputElement;

    private user: typeof User;

    private messageIdTimer: number;

    private inputIdTimer: number;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.user = User;
        this.messageIdTimer = -1;
        this.inputIdTimer = -1;
        this.handlers = this.makeHandlers();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            saveDataClick: (event: Event): void => {
                event.preventDefault();
                this.saveButton.disabled = true;
                const username = this.loginInput.value;
                const email = this.emailInput.value;
                const possibility = this.validate(username, email);
                if (possibility) {
                    this.changeUser(username, email);
                } else {
                    this.saveButton.disabled = false;
                }
            },
        };
    }

    activate(): void {
        if (!this.place) {
            return;
        }
        this.place.innerHTML = template(this.user.getData());

        this.saveButton = document.getElementById('button-save-data') as HTMLButtonElement;
        this.loginInput = document.getElementById('login-profile') as HTMLInputElement;
        this.emailInput = document.getElementById('email-profile') as HTMLInputElement;

        this.subscribeEvents();
    }

    private subscribeEvents(): void {
        this.saveButton.addEventListener('click', this.handlers.saveDataClick);
    }

    private unsubscribeEvents(): void {
        this.saveButton.removeEventListener('click', this.handlers.saveDataClick);
    }

    deactivate(): void {
        this.unsubscribeEvents();

        this.place.innerHTML = '';
    }

    private validate(username: string, email: string): boolean { // true, если все хорошо
        if (username === this.user.userName && email === this.user.email) {
            this.renderMessage('Вы ничего не изменили =)');
            return false;
        }

        if (username === '') {
            this.renderMessage('Заполните поле логина');
            this.renderInputError('login');
            return false;
        }

        if (email === '') {
            this.renderMessage('Заполните поле c почтой');
            this.renderInputError('email');
            return false;
        }

        const loginErrors = Validator.validateLogin(username);
        if (loginErrors.length > 0) {
            this.renderMessage(loginErrors[0]);
            this.renderInputError('login');
            return false;
        }

        const emailErrors = Validator.validateEmail(email);
        if (emailErrors.length > 0) {
            this.renderMessage(emailErrors[0]);
            this.renderInputError('email');
            return false;
        }

        return true;
    }

    private renderMessage(text: string, isErr = true): void {
        if (this.messageIdTimer !== -1) {
            window.clearTimeout(this.messageIdTimer);
        }
        const errLine = document.getElementById('text-error-data');
        if (isErr) {
            errLine.classList.remove('profile__text--accept');
            errLine.classList.add('profile__text--error');
        } else {
            errLine.classList.remove('profile__text--error');
            errLine.classList.add('profile__text--accept');
        }
        errLine.textContent = text;

        this.messageIdTimer = window.setTimeout(() => {
            if (errLine) {
                errLine.textContent = '';
            }
            this.messageIdTimer = -1;
        }, 5000);
    }

    private renderInputError(what: string): void {
        if (this.inputIdTimer !== -1) {
            window.clearTimeout(this.inputIdTimer);
        }
        let input: HTMLInputElement;

        switch (what) {
            case 'login': {
                input = document.getElementById('login-profile') as HTMLInputElement;
                break;
            }
            case 'email': {
                input = document.getElementById('email-profile') as HTMLInputElement;
                break;
            }
            default: {
                return;
            }
        }
        input.classList.add('profile__input--error');
        this.inputIdTimer = window.setTimeout(() => {
            if (input) {
                input.classList.remove('profile__input--error');
            }
            this.inputIdTimer = -1;
        }, 5000);
    }

    private changeUser(username: string, email: string): void {
        const response = NetworkUser.changeUser(username, email);
        response.then((value) => {
            this.saveButton.disabled = false;
            const { code } = value;
            switch (code) {
                case 200:
                    this.user.userName = username;
                    this.user.email = email;
                    this.renderMessage('Вы успешно все поменяли', false);
                    Events.trigger(CHANGE_USER_OK, this.user.getData());
                    break;
                case 400:
                    this.renderMessage('Неверный формат запроса', true);
                    break;
                case 401:
                    this.user.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 403:
                    Redirector.redirectError('Нет прав на изменение информации');
                    break;
                case 406:
                    this.renderMessage('Пользователь с таким email уже зарегистрирован', true);
                    break;
                case 409:
                    this.renderMessage('Пользователь с таким логином уже зарегистрирован', true);
                    break;
                default:
                    this.renderMessage(`Ошибка сервера: статус ${code || value.error}`, true);
                    break;
            }
        });
    }
}

import type { AbstractComponent } from '@interfaces/components';
import Validator from '@/helpers/validator/validator';
import NetworkUser from '@/helpers/network/network-user';
import * as template from '@profile/settings-password/settings-password.hbs';
import type { HandlerEvent } from '@interfaces/functions';
import User from '@/helpers/user/user';
import Redirector from '@/helpers/router/redirector';

export default class DataUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private saveButton?: HTMLButtonElement;

    private oldPasswordInput?: HTMLInputElement;

    private newPasswordFirstInput?: HTMLInputElement;

    private newPasswordSecondInput?: HTMLInputElement;

    private idTimer: number;

    private newPasswordInputIdTimer: number;

    private oldPasswordInputIdTimer: number;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.idTimer = -1;
        this.oldPasswordInputIdTimer = -1;
        this.newPasswordInputIdTimer = -1;
        this.handlers = {
            clickSave: this.clickSave.bind(this),
        };
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = template();

        this.saveButton = document.getElementById('button-save-sequr') as HTMLButtonElement;
        this.oldPasswordInput = document.getElementById('old-psw') as HTMLInputElement;
        this.newPasswordFirstInput = document.getElementById('new-psw1') as HTMLInputElement;
        this.newPasswordSecondInput = document.getElementById('new-psw2') as HTMLInputElement;

        this.saveButton.addEventListener('click', this.handlers.clickSave);
    }

    deactivate(): void {
        if (this.place.innerHTML === '') {
            return;
        }

        this.saveButton.removeEventListener('click', this.handlers.clickSave);

        this.place.innerHTML = '';
    }

    private clickSave(event: Event): void {
        event.preventDefault();

        this.saveButton.disabled = true;
        const possibility = this.validate();
        if (possibility) {
            this.updatePassword(this.oldPasswordInput.value, this.newPasswordFirstInput.value);
        } else {
            this.saveButton.disabled = false;
        }
    }

    private validate(): boolean { // true, если все хорошо
        const oldPassword = this.oldPasswordInput.value;
        const newPasswordFirst = this.newPasswordFirstInput.value;
        const newPasswordSecond = this.newPasswordSecondInput.value;

        if (oldPassword === '') {
            this.renderOldPasswordInputError();
            this.renderMessage('Вы не ввели старый пароль!');
            return false;
        }
        if (newPasswordFirst === '') {
            this.renderNewPasswordInputError();
            this.renderMessage('Необходимо заполнить все поля');
            return false;
        }
        if (newPasswordFirst !== newPasswordSecond) {
            this.renderNewPasswordInputError();
            this.renderMessage('Пароли не совпадают');
            return false;
        }
        if (oldPassword === newPasswordFirst) {
            this.renderNewPasswordInputError();
            this.renderOldPasswordInputError();
            this.renderMessage('Старый и новый пароль совпадает');
            return false;
        }

        const passwordErrors = Validator.validatePassword(newPasswordFirst);
        if (passwordErrors.length > 0) {
            this.renderNewPasswordInputError();
            this.renderMessage(passwordErrors[0]);
            return false;
        }

        return true;
    }

    private renderOldPasswordInputError(): void {
        if (this.oldPasswordInputIdTimer !== -1) {
            window.clearTimeout(this.oldPasswordInputIdTimer);
        }
        this.oldPasswordInput.classList.add('profile__input--error');
        this.oldPasswordInputIdTimer = window.setTimeout(() => {
            if (this.oldPasswordInput) {
                this.oldPasswordInput.classList.remove('profile__input--error');
            }
            this.oldPasswordInputIdTimer = -1;
        }, 5000);
    }

    private renderNewPasswordInputError(): void {
        if (this.newPasswordInputIdTimer !== -1) {
            window.clearTimeout(this.newPasswordInputIdTimer);
        }
        this.newPasswordFirstInput.classList.add('profile__input--error');
        this.newPasswordSecondInput.classList.add('profile__input--error');
        this.newPasswordInputIdTimer = window.setTimeout(() => {
            if (this.newPasswordFirstInput) {
                this.newPasswordFirstInput.classList.remove('profile__input--error');
                this.newPasswordSecondInput.classList.remove('profile__input--error');
            }
            this.newPasswordInputIdTimer = -1;
        }, 5000);
    }

    private clearInputs(): void {
        this.oldPasswordInput.value = '';
        this.newPasswordFirstInput.value = '';
        this.newPasswordSecondInput.value = '';
    }

    private renderMessage(text = '', isErr = true): void {
        if (this.idTimer !== -1) {
            window.clearTimeout(this.idTimer);
        }
        const errLine = document.getElementById('text-error-sequr');

        if (isErr) {
            errLine.classList.remove('profile__text--blue');
            errLine.classList.add('profile__text--red');
        } else {
            errLine.classList.remove('profile__text--red');
            errLine.classList.add('profile__text--blue');
        }

        errLine.textContent = text;

        this.idTimer = window.setTimeout(() => {
            if (errLine) {
                errLine.textContent = '';
            }
            this.idTimer = -1;
        }, 5000);
    }

    private updatePassword(oldPassword: string, password: string): void {
        const response = NetworkUser.updatePassword(oldPassword, password);
        response.then((value) => {
            this.saveButton.disabled = false;
            const { code } = value;
            switch (code) {
                case 200:
                    this.renderMessage('Вы успешно обновили пароль!', false);
                    this.clearInputs();
                    break;
                case 400:
                    this.renderMessage('Неверный формат запроса');
                    break;
                case 401:
                    const user = User;
                    user.clear();
                    user.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 402:
                    this.renderMessage('Вы ввели неверный пароль');
                    break;
                case 403:
                    Redirector.redirectError('Нет прав на изменение пароля');
                    break;
                default:
                    this.renderMessage(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }
}

import type { AbstractComponent } from '@interfaces/components';
import Validator from '@/helpers/validator/validator';
import NetworkUser from '@/helpers/network/network-user';
import * as template from '@profile/settings-password/settings-password.hbs';
import type { HandlerEvent } from '@interfaces/functions';
import User from '@/helpers/user/user';
import Redirector from '@/helpers/router/redirector';

export default class DataUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private saveButton: HTMLButtonElement;

    private oldPasswordInput: HTMLInputElement;

    private newPasswordFirstInput: HTMLInputElement;

    private newPasswordSecondInput: HTMLInputElement;

    private idTimer: number;

    private newFirstPasswordInputIdTimer: number;

    private newSecondPasswordInputIdTimer: number;

    private oldPasswordInputIdTimer: number;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.idTimer = -1;
        this.oldPasswordInputIdTimer = -1;
        this.newSecondPasswordInputIdTimer = -1;
        this.newFirstPasswordInputIdTimer = -1;
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
        const isDataRight = this.validate();
        if (isDataRight) {
            this.updatePassword(this.oldPasswordInput.value, this.newPasswordFirstInput.value);
            return;
        }
        this.saveButton.disabled = false;
    }

    private validate(): boolean { // true, если все хорошо
        const oldPassword = this.oldPasswordInput.value;
        const newPasswordFirst = this.newPasswordFirstInput.value;
        const newPasswordSecond = this.newPasswordSecondInput.value;

        const emptyFieldsNumbers = Validator.stringsEmpty({
            oldPassword,
            newPassword1: newPasswordFirst,
            newPassword2: newPasswordSecond,
        });
        if (emptyFieldsNumbers.length > 0) {
            this.renderMessage('Необходимо заполнить все поля', emptyFieldsNumbers);
            return false;
        }

        if (!Validator.isStringsEqual(newPasswordFirst, newPasswordSecond)) {
            this.renderMessage('Пароли не совпадают', ['newPassword1', 'newPassword2']);
            return false;
        }

        if (Validator.isStringsEqual(oldPassword, newPasswordFirst)) {
            this.renderMessage('Старый и новый пароль совпадает', ['oldPassword', 'newPassword1', 'newPassword2']);
            return false;
        }

        const passwordErrors = Validator.validatePassword(newPasswordFirst);
        if (passwordErrors.length > 0) {
            this.renderMessage(passwordErrors[0], ['newPassword1', 'newPassword2']);
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

    private renderNewFirstPasswordInputError(): void {
        if (this.newFirstPasswordInputIdTimer !== -1) {
            window.clearTimeout(this.newFirstPasswordInputIdTimer);
        }
        this.newPasswordFirstInput.classList.add('profile__input--error');
        this.newFirstPasswordInputIdTimer = window.setTimeout(() => {
            if (this.newPasswordFirstInput) {
                this.newPasswordFirstInput.classList.remove('profile__input--error');
            }
            this.newFirstPasswordInputIdTimer = -1;
        }, 5000);
    }

    private renderNewSecondPasswordInputError(): void {
        if (this.newSecondPasswordInputIdTimer !== -1) {
            window.clearTimeout(this.newSecondPasswordInputIdTimer);
        }
        this.newPasswordSecondInput.classList.add('profile__input--error');
        this.newSecondPasswordInputIdTimer = window.setTimeout(() => {
            if (this.newPasswordSecondInput) {
                this.newPasswordSecondInput.classList.remove('profile__input--error');
            }
            this.newSecondPasswordInputIdTimer = -1;
        }, 5000);
    }

    private clearInputs(): void {
        this.oldPasswordInput.value = '';
        this.newPasswordFirstInput.value = '';
        this.newPasswordSecondInput.value = '';
    }

    private renderMessage(text = '', errorInputs: string[] = []): void {
        if (this.idTimer !== -1) {
            window.clearTimeout(this.idTimer);
        }
        const errLine = document.getElementById('text-error-sequr');

        if (errorInputs.length > 0) {
            errLine.classList.remove('profile__text--accept');
            errLine.classList.add('profile__text--error');

            errorInputs.forEach((cur) => {
                switch (cur) {
                    case 'oldPassword':
                        this.renderOldPasswordInputError();
                        break;
                    case 'newPassword1':
                        this.renderNewFirstPasswordInputError();
                        break;
                    case 'newPassword2':
                        this.renderNewSecondPasswordInputError();
                        break;
                    default:
                        break;
                }
            });
        } else {
            errLine.classList.remove('profile__text--error');
            errLine.classList.add('profile__text--accept');
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
                    this.renderMessage('Вы успешно обновили пароль!');
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
                    this.renderMessage('Вы ввели неверный пароль', ['oldPassword']);
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

import { AbstractComponent } from '@interfaces/components';
import Validator from '@/helpers/validator/validator';
import NetworkUser from '@network/networkUser';
import * as template from '@profile/settings-password/settingsPassword.hbs';
import { HandlerEvent } from '@interfaces/functions';
import User from '@/helpers/user/user';
import Redirector from '@/helpers/router/redirector';

export default class DataUserComponent implements AbstractComponent {
    private place: HTMLDivElement;

    private saveButton?: HTMLButtonElement;

    private oldPasswordInput?: HTMLInputElement;

    private newPasswordFirstInput?: HTMLInputElement;

    private newPasswordSecondInput?: HTMLInputElement;

    private idTimer: number;

    private newPasswordInputIdTimer: number;

    private oldPasswordInputIdTimer: number;

    private handlers: Record<string, HandlerEvent>;

    constructor(place: HTMLDivElement) {
        this.place = place;

        this.idTimer = -1;
        this.oldPasswordInputIdTimer = -1;
        this.newPasswordInputIdTimer = -1;
        this.handlers = {
            clickSave: this.clickSave.bind(this),
        };
    }

    activate(): void {
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

        this.validate();
    }

    private validate(): void {
        const oldPassword = this.oldPasswordInput.value;
        const newPasswordFirst = this.newPasswordFirstInput.value;
        const newPasswordSecond = this.newPasswordSecondInput.value;

        if (oldPassword === '') {
            this.renderOldPasswordInputError();
            this.renderMessage('Необходимо заполнить все поля');
            return;
        }
        if (newPasswordFirst === '') {
            this.renderNewPasswordInputError();
            this.renderMessage('Необходимо заполнить все поля');
            return;
        }
        if (newPasswordFirst !== newPasswordSecond) {
            this.renderNewPasswordInputError();
            this.renderMessage('Пароли не совпадают');
            return;
        }
        if (oldPassword === newPasswordFirst) {
            this.renderNewPasswordInputError();
            this.renderOldPasswordInputError();
            this.renderMessage('Старый и новый пароль совпадает');
            return;
        }

        const passwordErrors = Validator.validatePassword(newPasswordFirst);
        if (passwordErrors.length > 0) {
            this.renderNewPasswordInputError();
            this.renderMessage(passwordErrors[0]);
            return;
        }

        this.updatePassword(oldPassword, newPasswordFirst);
    }

    private renderOldPasswordInputError(): void {
        if (this.oldPasswordInputIdTimer !== -1) {
            window.clearTimeout(this.oldPasswordInputIdTimer);
        }
        this.oldPasswordInput.className += ' profile__input--error';
        this.oldPasswordInputIdTimer = window.setTimeout(() => {
            if (this.oldPasswordInput) {
                this.oldPasswordInput.className = 'profile__input';
            }
            this.oldPasswordInputIdTimer = -1;
        }, 5000);
    }

    private renderNewPasswordInputError(): void {
        if (this.newPasswordInputIdTimer !== -1) {
            window.clearTimeout(this.newPasswordInputIdTimer);
        }
        this.newPasswordFirstInput.className += ' profile__input--error';
        this.newPasswordSecondInput.className += ' profile__input--error';
        this.newPasswordInputIdTimer = window.setTimeout(() => {
            if (this.newPasswordFirstInput) {
                this.newPasswordFirstInput.className = 'profile__input';
                this.newPasswordSecondInput.className = 'profile__input';
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
            errLine.className += ' profile__text--red';
        } else {
            errLine.className += ' profile__text--blue';
        }

        errLine.textContent = text;

        this.idTimer = window.setTimeout(() => {
            if (errLine) {
                errLine.textContent = '';
                errLine.className = 'profile__text profile__text--center';
            }
            this.idTimer = -1;
        }, 5000);
    }

    private updatePassword(oldPassword: string, password: string): void {
        const response = NetworkUser.updatePassword(oldPassword, password);
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    this.renderMessage('Вы успешно обновили пароль!', true);
                    this.clearInputs();
                    break;
                case 400:
                    this.renderMessage('Неверный формат запроса');
                    break;
                case 401:
                    const user = User.getInstance();
                    user.clear();
                    user.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 402:
                    this.renderMessage('Вы ввели неверный пароль');
                    break;
                case 403:
                    Redirector.redirectError('Нет csrf');
                    break;
                default:
                    this.renderMessage(`Ошибка сервера - ${code}`);
                    break;
            }
        });
    }
}

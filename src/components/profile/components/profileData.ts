import { UserData } from '@interfaces/structsData/userData';
import { AbstractComponent } from '@interfaces/components';

import * as dataTemplate from '@profile/templates/profileData.hbs';
import * as buttonTemplate from '@profile/templates/profileButtonTemplate.hbs';
import * as messageTemplate from '@profile/templates/profileMessage.hbs';
import { HandlerEvent } from '@interfaces/functions';
import User from '@user/user';
import NetworkUser from '@network/networkUser';
import Redirector from '@/helpers/router/redirector';

export default class DataUserComponent implements AbstractComponent {
    private place: HTMLDivElement;

    private exitButton?: HTMLButtonElement;

    private reloadAvatarButton?: HTMLButtonElement;

    private inputAvatar?: HTMLInputElement;

    private avatarImage?: HTMLImageElement;

    private avatarForm?: HTMLFormElement;

    private divAvatarBottom?: HTMLDivElement;

    private handlers: Record<string, HandlerEvent>;

    private idTimer: number;

    constructor(place: HTMLDivElement) {
        this.place = place;

        this.handlers = this.makeHandlers();
    }

    activate(user: UserData): void {
        this.place.innerHTML = dataTemplate(user);

        this.inputAvatar = document.getElementById('profile-pic') as HTMLInputElement;
        this.exitButton = document.getElementById('btn-exit') as HTMLButtonElement;
        this.avatarImage = document.getElementById('img-profile') as HTMLImageElement;
        this.avatarForm = document.getElementById('avatar-form') as HTMLFormElement;
        this.divAvatarBottom = document.getElementById('div-avatar-bottom') as HTMLDivElement;

        this.subscribeEvents();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            newImage: (event: Event) => {
                event.preventDefault();
                this.divAvatarBottom.innerHTML = buttonTemplate();
                this.reloadAvatarButton = document.getElementById('btn-reload') as HTMLButtonElement;
                this.reloadAvatarButton.addEventListener('click', this.handlers.updateAvatarClick);
                const file = this.inputAvatar.files[0];
                const reader = new FileReader();
                this.avatarImage.title = file.name;
                reader.onload = (evt) => {
                    this.avatarImage.src = evt.target.result as string;
                };
                reader.readAsDataURL(file);
            },
            updateAvatarClick: (event: Event) => {
                event.preventDefault();
                this.updateAvatar(this.avatarForm);
                this.reloadAvatarButton.removeEventListener('click', this.handlers.updateAvatarClick);
                this.divAvatarBottom.innerHTML = '';
                this.inputAvatar.value = '';
            },
            signoutClick: (event: Event) => {
                event.preventDefault();
                this.signout();
            },
        };
    }

    private subscribeEvents(): void {
        this.inputAvatar.addEventListener('change', this.handlers.newImage);
        this.exitButton.addEventListener('click', this.handlers.signoutClick);
    }

    private unsubscribeEvents(): void {
        if (!this.avatarForm) {
            return;
        }

        this.inputAvatar.removeEventListener('change', this.handlers.newImage);
        this.exitButton.removeEventListener('click', this.handlers.signoutClick);
        if (this.reloadAvatarButton) {
            this.reloadAvatarButton.removeEventListener('click', this.handlers.updateAvatarClick);
        }
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    updateData(username: string, email: string): void {
        document.getElementById('label-login').textContent = username;
        document.getElementById('label-email').textContent = email;
    }

    private renderMessage(message: string, isErr = false): void {
        if (this.idTimer !== -1) {
            window.clearTimeout(this.idTimer);
        }

        this.divAvatarBottom.innerHTML = messageTemplate({ text: message });
        const msg = document.getElementById('msg-avatar');
        if (isErr) {
            msg.className += ' profile__text--red';
        } else {
            msg.className += ' profile__text--blue';
        }

        this.idTimer = window.setTimeout(() => {
            this.divAvatarBottom.removeChild(msg);
            this.idTimer = -1;
        }, 5000);
    }

    private updateAvatar(formAvatar: HTMLFormElement): void {
        const user = User.getInstance();
        const response = NetworkUser.updateAvatar(new FormData(formAvatar));
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    user.avatar = value.data as string;
                    this.avatarImage.src = user.avatar;
                    this.renderMessage('Аватарка обновлена');
                    break;
                case 400:
                    this.renderMessage('Неверный формат запроса');
                    break;
                case 401:
                    user.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 403:
                    Redirector.redirectError('Нет csrf');
                    break;
                case 415:
                    this.renderMessage('Можно загружать только файлы с расширением jpg, png');
                    break;
                default:
                    this.renderMessage(`Ошибка сервера: статус - ${code}`);
                    break;
            }
        });
    }

    private signout(): void {
        const response = NetworkUser.signout();
        response.then((value) => {
            const { code } = value;
            const user = User.getInstance();
            switch (code) {
                case 200:
                    user.clear();
                    Redirector.redirectTo('/signin');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера: статус ${code}`);
                    break;
            }
        });
    }
}

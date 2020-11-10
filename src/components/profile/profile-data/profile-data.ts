import type { UserData } from '@/helpers/interfaces/structs-data/user-data';
import type { AbstractComponent } from '@interfaces/components';
import type { HandlerEvent } from '@interfaces/functions';

import * as dataTemplate from '@profile/profile-data/profile-data.hbs';
import * as buttonTemplate from '@profile/profile-data/button.hbs';
import * as messageTemplate from '@profile/profile-data/message.hbs';
import User from '@user/user';
import NetworkUser from '@/helpers/network/network-user';
import Redirector from '@/helpers/router/redirector';

export default class DataUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private exitButton?: HTMLButtonElement;

    private reloadAvatarButton?: HTMLButtonElement;

    private inputAvatar?: HTMLInputElement;

    private avatarImage?: HTMLImageElement;

    private avatarForm?: HTMLFormElement;

    private divAvatarBottom?: HTMLDivElement;

    private handlers: Record<string, HandlerEvent>;

    private idTimer: number;

    constructor() {
        this.idTimer = -1;
        this.handlers = this.makeHandlers();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(user: UserData): void {
        if (!this.place) {
            return;
        }
        this.place.innerHTML = dataTemplate(user);

        this.inputAvatar = document.getElementById('profile-pic') as HTMLInputElement;
        this.exitButton = document.getElementById('button-exit') as HTMLButtonElement;
        this.avatarImage = document.getElementById('img-profile') as HTMLImageElement;
        this.avatarForm = document.getElementById('avatar-form') as HTMLFormElement;
        this.divAvatarBottom = document.getElementById('div-avatar-bottom') as HTMLDivElement;

        this.subscribeEvents();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            newImage: (event: Event): void => {
                event.preventDefault();
                this.divAvatarBottom.innerHTML = buttonTemplate();
                this.reloadAvatarButton = document.getElementById('button-reload') as HTMLButtonElement;
                this.reloadAvatarButton.addEventListener('click', this.handlers.updateAvatarClick);
                const file = this.inputAvatar.files[0];
                if (this.inputAvatar.files.length === 0) {
                    return;
                }
                if (file.size > 5242880) { // 5мб
                    this.renderMessage('Размер изображения не должен превышать 5мб', true);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (evt): void => {
                    this.avatarImage.src = evt.target.result as string;
                };
                reader.readAsDataURL(file);
            },
            updateAvatarClick: (event: Event): void => {
                event.preventDefault();
                this.updateAvatar(this.avatarForm);
                this.reloadAvatarButton.removeEventListener('click', this.handlers.updateAvatarClick);
                this.divAvatarBottom.innerHTML = '';
                this.inputAvatar.value = '';
            },
            signoutClick: (event: Event): void => {
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
                    this.avatarImage.src = user.avatar;
                    this.renderMessage('Неверный формат данных', true);
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
                    this.renderMessage(`Ошибка сервера: статус - ${code || value.error}`);
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
                    Redirector.redirectError(`Ошибка сервера: статус ${code || value.error}`);
                    break;
            }
        });
    }
}

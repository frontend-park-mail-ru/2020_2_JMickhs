import { ERROR_DEFAULT, ERROR_403, ERROR_400 } from '@global-variables/network-error';
import type { UserData } from '@interfaces/structs-data/user-data';
import type { AbstractComponent } from '@interfaces/components';

import * as dataTemplate from '@profile/profile-data/profile-data.hbs';
import * as buttonTemplate from '@profile/profile-data/button.hbs';
import User from '@user/user';
import NetworkUser from '@network/network-user';
import Redirector from '@router/redirector';
// import NotificationUser from '@/components/notification-user/notification-user';
import MessagePopup from '@/components/message-popup/message-popup';

const AVATAR_UPDATE_MESSAGE = 'Аватарка обновлена';
const ERROR_EXTENSION_FILE = 'Можно загружать только файлы с расширением jpg, png';
const ERROR_SIZE_FILE = 'Размер изображения не должен превышать 5мб';
const MAX_SIZE_FILE = 5242880; // 5мб

export default class DataUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private exitButton: HTMLButtonElement;

    private reloadAvatarButton?: HTMLButtonElement;

    private inputAvatar: HTMLInputElement;

    private avatarImage: HTMLImageElement;

    private avatarForm: HTMLFormElement;

    private divAvatarButton: HTMLDivElement;

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
        this.divAvatarButton = document.getElementById('div-avatar-bottom') as HTMLDivElement;

        this.subscribeEvents();
    }

    private newImage = (event: Event): void => {
        event.preventDefault();
        this.divAvatarButton.innerHTML = buttonTemplate();
        this.reloadAvatarButton = document.getElementById('button-reload') as HTMLButtonElement;
        this.reloadAvatarButton.addEventListener('click', this.updateAvatarClick);
        const file = this.inputAvatar.files[0];
        if (this.inputAvatar.files.length === 0) {
            return;
        }
        if (file.size > MAX_SIZE_FILE) { // 5мб
            this.renderMessage(ERROR_SIZE_FILE, true);
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt): void => {
            this.avatarImage.src = evt.target.result as string;
        };
        reader.readAsDataURL(file);
    };

    private updateAvatarClick = (event: Event): void => {
        event.preventDefault();
        this.updateAvatar(this.avatarForm);
        this.reloadAvatarButton.removeEventListener('click', this.updateAvatarClick);
        this.divAvatarButton.innerHTML = '';
        this.inputAvatar.value = '';
    };

    private signoutClick = (event: Event): void => {
        event.preventDefault();
        this.exitButton.disabled = true;
        this.signout();
    };

    private subscribeEvents(): void {
        this.inputAvatar.addEventListener('change', this.newImage);
        this.exitButton.addEventListener('click', this.signoutClick);
    }

    private unsubscribeEvents(): void {
        if (!this.avatarForm) {
            return;
        }

        this.inputAvatar.removeEventListener('change', this.newImage);
        this.exitButton.removeEventListener('click', this.signoutClick);
        if (this.reloadAvatarButton) {
            this.reloadAvatarButton.removeEventListener('click', this.updateAvatarClick);
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
        // NotificationUser.showMessage(message, isErr);
        MessagePopup.addMessage(message, isErr);
    }

    private updateAvatar(formAvatar: HTMLFormElement): void {
        const response = NetworkUser.updateAvatar(new FormData(formAvatar));
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    User.avatar = value.data as string;
                    this.avatarImage.src = User.avatar;
                    this.renderMessage(AVATAR_UPDATE_MESSAGE);
                    break;
                case 400:
                    this.avatarImage.src = User.avatar;
                    this.renderMessage(ERROR_400, true);
                    break;
                case 401:
                    User.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 403:
                    this.renderMessage(ERROR_403, true);
                    break;
                case 415:
                    this.renderMessage(ERROR_EXTENSION_FILE, true);
                    break;
                default:
                    this.renderMessage(`${ERROR_DEFAULT}${code || value.error}`, true);
                    break;
            }
        });
    }

    private signout(): void {
        const response = NetworkUser.signout();
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    User.clear();
                    Redirector.redirectTo('/signin');
                    break;
                default:
                    this.renderMessage(`${ERROR_DEFAULT}${code || value.error}`, true);
                    break;
            }
        });
    }
}

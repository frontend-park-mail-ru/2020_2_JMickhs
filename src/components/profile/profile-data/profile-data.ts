import type { UserData } from '@interfaces/structs-data/user-data';
import type { AbstractComponent } from '@interfaces/components';

import * as dataTemplate from '@profile/profile-data/profile-data.hbs';
import * as buttonTemplate from '@profile/profile-data/button.hbs';
import User from '@user/user';
import NetworkUser from '@network/network-user';
import Redirector from '@router/redirector';
import NotificationUser from '@/components/notification-user/notification-user';

export default class DataUserComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private exitButton: HTMLButtonElement;

    private reloadAvatarButton?: HTMLButtonElement;

    private inputAvatar: HTMLInputElement;

    private avatarImage: HTMLImageElement;

    private avatarForm: HTMLFormElement;

    private divAvatarBottom: HTMLDivElement;

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

    private newImage = (event: Event): void => {
        event.preventDefault();
        this.divAvatarBottom.innerHTML = buttonTemplate();
        this.reloadAvatarButton = document.getElementById('button-reload') as HTMLButtonElement;
        this.reloadAvatarButton.addEventListener('click', this.updateAvatarClick);
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
    };

    private updateAvatarClick = (event: Event): void => {
        event.preventDefault();
        this.updateAvatar(this.avatarForm);
        this.reloadAvatarButton.removeEventListener('click', this.updateAvatarClick);
        this.divAvatarBottom.innerHTML = '';
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
        NotificationUser.showMessage(message, isErr, 5000);
    }

    private updateAvatar(formAvatar: HTMLFormElement): void {
        const response = NetworkUser.updateAvatar(new FormData(formAvatar));
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    User.avatar = value.data as string;
                    this.avatarImage.src = User.avatar;
                    this.renderMessage('Аватарка обновлена');
                    break;
                case 400:
                    this.avatarImage.src = User.avatar;
                    this.renderMessage('Неверный формат данных', true);
                    break;
                case 401:
                    User.isAuth = false;
                    Redirector.redirectTo('/signin');
                    break;
                case 403:
                    this.renderMessage('Нет прав на обновление аватарки', true);
                    break;
                case 415:
                    this.renderMessage('Можно загружать только файлы с расширением jpg, png', true);
                    break;
                default:
                    this.renderMessage(`Ошибка - ${code || value.error}`, true);
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
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }
}

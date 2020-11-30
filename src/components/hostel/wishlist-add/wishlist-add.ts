import type { AbstractComponent } from '@interfaces/components';
import Redirector from '@router/redirector';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';
import NetworkWishlist from '@network/network-wishlist';
import Events from '@eventbus/eventbus';
import { DEACTIVATE_POPUP } from '@eventbus/constants';
import {
    ERROR_400,
    ERROR_401,
    ERROR_403,
    ERROR_DEFAULT,
} from '@/helpers/global-variables/network-error';
import NotificationUser from '@/components/notification-user/notification-user';

import * as template from './wishlist-add.hbs';
import './wishlist-add.css';

const ERROR_ALIEN_WISHLIST = 'Вы обращаетесь к чужому списку избранного';

export default class WishlistAddComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private hostelId: number;

    private wishlists: WishlistsStruct[];

    private createWishlistButton: HTMLButtonElement;

    private namesContainerElement: HTMLDivElement;

    private newWishlistInput: HTMLInputElement;

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(hostelId: number): void {
        this.hostelId = hostelId;
        this.getWishlists();
    }

    private render(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = template({ wishlists: this.wishlists, hostelId: this.hostelId });
        this.createWishlistButton = document.getElementById('new-wishlist-button') as HTMLButtonElement;
        this.namesContainerElement = document.getElementById('ames-container') as HTMLDivElement;
        this.createWishlistButton = document.getElementById('create-button') as HTMLButtonElement;
        this.namesContainerElement = document.getElementById('names-container') as HTMLDivElement;

        this.subscribeEvents();
    }

    deactivate(): void {
        if (!this.place) {
            return;
        }
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    subscribeEvents(): void {
        this.createWishlistButton.addEventListener('click', this.buttonClick);
        this.wishlists.forEach((wishlist) => {
            const element = document.getElementById(`wishlist-name-${wishlist.wishlist_id}-${this.hostelId}`);
            element.addEventListener('click', this.toWishlist);
        });
    }

    unsubscribeEvents(): void {
        this.createWishlistButton.removeEventListener('click', this.buttonClick);
        this.wishlists.forEach((wishlist) => {
            const element = document.getElementById(`wishlist-name-${wishlist.wishlist_id}-${this.hostelId}`);
            element?.removeEventListener('click', this.toWishlist); // вопросительный знак на всякий случай
        });
    }

    private createWishlist(): void {
        this.newWishlistInput = document.createElement('input');
        this.newWishlistInput.classList.add('wishlist-add__name');
        this.newWishlistInput.classList.add('wishlist-add__name-input');
        this.newWishlistInput.placeholder = 'Введите название';
        this.namesContainerElement.appendChild(this.newWishlistInput);
        this.createWishlistButton.id = 'accept-button';
        this.createWishlistButton.innerText = 'Подтвердить создание';
        this.newWishlistInput.addEventListener('keyup', this.keyboardInputClick);
        this.createWishlistButton.disabled = true;
    }

    private keyboardInputClick = (event: KeyboardEvent): void => {
        if (this.newWishlistInput.value === '') {
            this.createWishlistButton.disabled = true;
            return;
        }
        this.createWishlistButton.disabled = false;
        if (event.code === 'Enter') {
            this.buttonClick();
        }
    };

    private acceptWishlist(id: number): void {
        this.newWishlistInput.removeEventListener('keyup', this.keyboardInputClick);
        const inputValue = this.newWishlistInput.value;
        this.createWishlistButton.id = 'create-button';
        this.createWishlistButton.innerText = 'Создать новую папку';
        const newWishlistName = document.createElement('div');
        newWishlistName.classList.add('wishlist-add__name');
        newWishlistName.innerText = inputValue;
        newWishlistName.id = `wishlist-name-${id}-${this.hostelId}`;
        this.namesContainerElement.removeChild(this.newWishlistInput);
        this.namesContainerElement.appendChild(newWishlistName);
        newWishlistName.addEventListener('click', this.toWishlist);
        this.newWishlistInput = undefined;
        this.wishlists.push({ name: inputValue, wishlist_id: id });
    }

    private buttonClick = (): void => {
        if (this.createWishlistButton.id === 'create-button') {
            this.createWishlist();
        } else if (this.createWishlistButton.id === 'accept-button') {
            this.createWishlistResponse(this.newWishlistInput.value);
        }
    };

    private toWishlist = (evt: Event): void => {
        const element = evt.target as HTMLElement;
        const elementId = element.id;
        const array = elementId.split('-');
        const wishlistId = array[2];
        const hostelId = array[3];
        const response = NetworkWishlist.addHostelToWishlist(+wishlistId, +hostelId);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    NotificationUser.showMessage(`Отель добавлен в папку с названием ${element.innerText}`);
                    break;
                case 400:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_400);
                    break;
                case 403:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_403);
                    break;
                case 409:
                    NotificationUser.showMessage(`Этот отель уже в папку с названием ${element.innerText}`);
                    break;
                case 423:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_ALIEN_WISHLIST);
                    break;
                default:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    };

    private getWishlists(): void {
        const response = NetworkWishlist.getUserWishlists();

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {wishlists: WishlistsStruct[]};
                    this.wishlists = data.wishlists || [];
                    this.render();
                    break;
                case 400:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_400);
                    break;
                case 401:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_401);
                    break;
                default:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }

    private createWishlistResponse(name: string): void {
        const response = NetworkWishlist.createWishlist(name);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as WishlistsStruct;
                    this.acceptWishlist(data.wishlist_id);
                    break;
                case 400:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_400);
                    break;
                case 403:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_403);
                    break;
                case 423:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(ERROR_ALIEN_WISHLIST);
                    break;
                default:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    }
}

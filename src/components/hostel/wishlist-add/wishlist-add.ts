import type { AbstractComponent } from '@interfaces/components';
import Redirector from '@router/redirector';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';
import NetworkWishlist from '@network/network-wishlist';
import Events from '@eventbus/eventbus';
import { DEACTIVATE_POPUP } from '@eventbus/constants';

import * as template from './wishlist-add.hbs';
import './wishlist-add.css';

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
        if (this.wishlists) {
            this.wishlists.forEach((cur) => {
                const element = document.getElementById(`wishlist-name-${cur.wishlist_id}-${this.hostelId}`);
                element.addEventListener('click', this.toWishlist);
            });
        }
    }

    unsubscribeEvents(): void {
        this.createWishlistButton.removeEventListener('click', this.buttonClick);
        if (this.wishlists) {
            this.wishlists.forEach((cur) => {
                const element = document.getElementById(`wishlist-name-${cur.wishlist_id}-${this.hostelId}`);
                element.removeEventListener('click', this.toWishlist);
            });
        }
    }

    private createWishlist(): void {
        this.newWishlistInput = document.createElement('input');
        this.newWishlistInput.classList.add('wishlist-add__name');
        this.newWishlistInput.classList.add('wishlist-add__name-input');
        this.newWishlistInput.placeholder = 'Введите название';
        this.namesContainerElement.appendChild(this.newWishlistInput);
        this.createWishlistButton.id = 'accept-button';
        this.createWishlistButton.innerText = 'Подтвердить создание';
    }

    private acceptWishlist(id: number): void {
        const inputValue = this.newWishlistInput.value;
        this.createWishlistButton.id = 'create-button';
        this.createWishlistButton.innerText = 'Создать новое избранное';
        const newWishlistName = document.createElement('div');
        newWishlistName.classList.add('wishlist-add__name');
        newWishlistName.innerText = inputValue;
        newWishlistName.id = `wishlist-name-${id}-${this.hostelId}`;
        this.namesContainerElement.removeChild(this.newWishlistInput);
        this.namesContainerElement.appendChild(newWishlistName);
        newWishlistName.addEventListener('click', this.toWishlist);
        delete this.newWishlistInput;
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
        const elementId = (<HTMLElement>evt.target).id;
        const array = elementId.split('-');
        const wishlistId = array[2];
        const hostelId = array[3];
        const response = NetworkWishlist.addHostelToWishlist(+wishlistId, +hostelId);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    Events.trigger(DEACTIVATE_POPUP);
                    break;
                case 400:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                case 403:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError('Нет прав для совершения операции');
                    break;
                case 409:
                    Events.trigger(DEACTIVATE_POPUP);
                    break;
                case 423:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError('Вы обращаетесь к чужому списку избранного');
                    break;
                default:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
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
                    this.wishlists = data.wishlists;
                    this.render();
                    break;
                case 400:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                default:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
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
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                case 403:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError('Нет прав для совершения операции');
                    break;
                case 423:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError('Вы обращаетесь к чужому списку избранного');
                    break;
                default:
                    Events.trigger(DEACTIVATE_POPUP);
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }
}

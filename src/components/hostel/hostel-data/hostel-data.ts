import './hostel-data.css';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import Events from '@eventbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
    UPDATE_WISHLISTS,
} from '@eventbus/constants';
import type { AbstractComponent } from '@interfaces/components';
import * as dataTemplate from '@hostel/hostel-data/hostel-data.hbs';
import WishlistAddComponent from '@hostel/wishlist-add/wishlist-add';
import Popup from '@popup/popup';
import mapComponent from '@hostel/map/map';
import User from '@/helpers/user/user';
import NetworkWishlist from '@network/network-wishlist';
import Redirector from '@router/redirector';
import {
    ERROR_400,
    ERROR_DEFAULT,
} from '@global-variables/network-error';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';

const MAX_WISHLISTS_ELEMENTS = 3;
const MAP_ZOOM = 16;

export default class HostelDataComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private mapComponent: typeof mapComponent;

    private wishlistAddComponent: WishlistAddComponent;

    private buttonMap?: HTMLButtonElement;

    private wishlistButton?: HTMLButtonElement;

    private hostel: HostelData;

    private wishlists: WishlistsStruct[];

    constructor() {
        this.mapComponent = mapComponent;
        this.wishlistAddComponent = new WishlistAddComponent();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(hostel: HostelData): void {
        if (!this.place) {
            return;
        }

        this.hostel = hostel;
        this.wishlists = [];
        if (User.isAuth) {
            this.getWishlists();
            return;
        }
        this.render(this.hostel, this.wishlists);
    }

    private render(hostel: HostelData, wishlists: WishlistsStruct[]): void {
        const moreThanMaxWishlists = this.wishlists.length > MAX_WISHLISTS_ELEMENTS;
        this.place.innerHTML = dataTemplate({
            hostel,
            isAuth: User.isAuth,
            wishlists,
            moreThanMaxWishlists,
        });

        this.buttonMap = document.getElementById('map-button') as HTMLButtonElement;
        this.wishlistButton = document.getElementById('wishlist-button') as HTMLButtonElement;

        this.subscribeEvents();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(UPDATE_RATING_HOSTEL, this.updateTextData);
        Events.subscribe(UPDATE_WISHLISTS, this.updateWishlists);
        this.buttonMap?.addEventListener('click', this.clickMapButton);
        this.wishlistButton?.addEventListener('click', this.clickWishlistButton);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_RATING_HOSTEL, this.updateTextData);
        Events.unsubscribe(UPDATE_WISHLISTS, this.updateWishlists);
        this.buttonMap?.removeEventListener('click', this.clickMapButton);
        this.wishlistButton?.removeEventListener('click', this.clickWishlistButton);
    }

    private updateTextData = (arg: {rating: number, delta: number}): void => {
        this.hostel.countComments += arg.delta;
        this.hostel.rating = arg.rating;

        this.unsubscribeEvents();
        this.render(this.hostel, this.wishlists);
    };

    private updateWishlists = (arg: {id: number, name: string}): void => {
        this.wishlists.push({ name: arg.name, wishlist_id: arg.id });

        this.unsubscribeEvents();
        this.render(this.hostel, this.wishlists.slice(0, MAX_WISHLISTS_ELEMENTS));
    };

    private clickMapButton = (evt: Event): void => {
        evt.preventDefault();
        Popup.activate(this.mapComponent,
            { latitude: this.hostel.latitude, longitude: this.hostel.longitude },
            MAP_ZOOM,
            (): void => {
                Popup.deactivate();
            });
    };

    private clickWishlistButton = (evt: Event): void => {
        evt.preventDefault();
        Popup.activate(this.wishlistAddComponent, this.hostel.id);
    };

    private getWishlists = (): void => {
        const response = NetworkWishlist.getHostelsWishlists(this.hostel.id);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {wishlists: WishlistsStruct[]};
                    this.wishlists = data.wishlists || [];
                    this.render(this.hostel, this.wishlists.slice(0, MAX_WISHLISTS_ELEMENTS));
                    break;
                case 400:
                    Redirector.redirectError(ERROR_400);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    };
}

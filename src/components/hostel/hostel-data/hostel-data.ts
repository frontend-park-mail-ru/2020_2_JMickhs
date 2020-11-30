import './hostel-data.css';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import Events from '@eventbus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
} from '@eventbus/constants';
import type { AbstractComponent } from '@interfaces/components';
import * as dataTemplate from '@hostel/hostel-data/hostel-data.hbs';
import WishlistAddComponent from '@hostel/wishlist-add/wishlist-add';
import Popup from '@popup/popup';
import MapComponent from '@hostel/map/map';
import User from '@/helpers/user/user';

export default class HostelDataComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private mapComponent: MapComponent;

    private wishlistAddComponent: WishlistAddComponent;

    private buttonMap: HTMLButtonElement;

    private wishlistButton?: HTMLButtonElement;

    private hostel: HostelData;

    constructor() {
        this.mapComponent = new MapComponent();
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
        this.render(this.hostel);
    }

    private render(hostel: HostelData): void {
        this.place.innerHTML = dataTemplate({ hostel, isAuth: User.isAuth });

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
        this.buttonMap.addEventListener('click', this.clickMapButton);
        this.wishlistButton?.addEventListener('click', this.clickWishlistButton);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_RATING_HOSTEL, this.updateTextData);
        this.buttonMap.removeEventListener('click', this.clickMapButton);
        this.wishlistButton?.removeEventListener('click', this.clickWishlistButton);
    }

    private updateTextData = (arg: {rating: number, delta: number}): void => {
        this.hostel.countComments += arg.delta;
        this.hostel.rating = arg.rating;

        this.unsubscribeEvents();
        this.render(this.hostel);
    };

    private clickMapButton = (evt: Event): void => {
        evt.preventDefault();
        Popup.activate(this.mapComponent, this.hostel.latitude, this.hostel.longitude);
    };

    private clickWishlistButton = (evt: Event): void => {
        evt.preventDefault();
        Popup.activate(this.wishlistAddComponent, this.hostel.id);
    };
}

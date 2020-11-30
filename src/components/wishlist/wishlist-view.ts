import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import * as wishlistTemplate from '@wishlist/templates/wishlistTemplate.hbs';

import '@wishlist/templates/wishlist.css';
import ListComponent from '@home/list-hostels/list-hostels';
import { FILL_HOSTELS_WISHLIST } from '@eventbus/constants';
import type { HostelData } from '@interfaces/structs-data/hostel-data';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';
import WishlistsListComponent from '@wishlist/wishlists-list/wishlists-list';

export default class WishlistView extends PageView {
    private listHotelsComponent: ListComponent;

    private wishlistsListComponent: WishlistsListComponent;

    constructor(place: HTMLElement) {
        super(place);

        this.listHotelsComponent = new ListComponent();
        this.wishlistsListComponent = new WishlistsListComponent();
    }

    set wishlists(value: WishlistsStruct[]) {
        this.wishlistsListComponent.wishlists = value;
    }

    get wishlists(): WishlistsStruct[] {
        return this.wishlistsListComponent.wishlists;
    }

    render(error: string = undefined): void {
        this.page.innerHTML = wishlistTemplate({ error });
        this.subscribeEvents();

        this.listHotelsComponent.setPlace(document.getElementById('wishlist-hotels') as HTMLDivElement);
        this.wishlistsListComponent.setPlace(document.getElementById('wishlist-list') as HTMLDivElement);
        this.wishlistsListComponent.activate();
    }

    renderError(error: string): void {
        this.page.innerHTML = wishlistTemplate({ error });
        this.subscribeEvents();
        this.listHotelsComponent.setPlace(document.getElementById('wishlist-hotels') as HTMLDivElement);
        this.wishlistsListComponent.setPlace(document.getElementById('wishlist-list') as HTMLDivElement);
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }

        this.listHotelsComponent.deactivate();
        this.wishlistsListComponent.deactivate();

        this.unsubscribeEvents();
        this.page.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(FILL_HOSTELS_WISHLIST, this.fillHostels);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(FILL_HOSTELS_WISHLIST, this.fillHostels);
    }

    private fillHostels = (hostels: HostelData[]): void => {
        this.listHotelsComponent.activate(hostels);
    };
}

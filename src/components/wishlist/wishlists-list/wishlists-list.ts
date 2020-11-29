import * as filtrationTemplate from '@wishlist/wishlists-list/wishlistsListTemplate.hbs';
import '@wishlist/wishlists-list/wishlists-list.css';
import type { AbstractComponent } from '@interfaces/components';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';

export default class WishlistsListComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private wishlist: WishlistsStruct[];

    activate(): void {
        if (!this.place) {
            return;
        }

        this.render();
        this.subscribeEvents();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.hide();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    set wishlists(value: WishlistsStruct[]) {
        this.wishlist = value;
    }

    get wishlists(): WishlistsStruct[] {
        return this.wishlist;
    }

    subscribeEvents(): void {
    }

    unsubscribeEvents(): void {
    }

    render(): void {
        window.scrollTo(0, 0);
        this.place.innerHTML = filtrationTemplate(this.wishlists);
    }

    hide(): void {
        if (this.place) {
            this.place.innerHTML = '';
        }
    }
}

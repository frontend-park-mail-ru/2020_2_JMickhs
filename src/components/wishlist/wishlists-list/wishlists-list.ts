import * as filtrationTemplate from '@wishlist/wishlists-list/wishlistsListTemplate.hbs';
import '@wishlist/wishlists-list/wishlists-list.css';
import type { AbstractComponent } from '@interfaces/components';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';
import NetworkWishlist from '@network/network-wishlist';
import Redirector from '@router/redirector';
import { ERROR_400, ERROR_403, ERROR_DEFAULT } from '@global-variables/network-error';

const ERROR_ALIEN_WISHLIST = 'Вы обращаетесь к чужому списку избранного';

export default class WishlistsListComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    public wishlists: WishlistsStruct[];

    private currentWishlistId: number;

    private currentWishlistDeleteIcon?: HTMLElement;

    activate(wishlistId : number): void {
        if (!this.place) {
            return;
        }

        this.currentWishlistId = wishlistId;
        this.render();
        this.findCurrentWishlist();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.hide();
    }

    private findCurrentWishlist(): void {
        this.currentWishlistDeleteIcon = document.getElementById(`svg-${this.currentWishlistId}`);
        this.currentWishlistDeleteIcon?.classList.remove('wishlists-list__display-none');
        const currentWishlist = document.getElementById(`name-${this.currentWishlistId}`) as HTMLAnchorElement;
        currentWishlist.classList.add('wishlists-list__cursor-auto');
        this.currentWishlistDeleteIcon?.addEventListener('click', this.deleteWishlist);
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    unsubscribeEvents(): void {
        this.currentWishlistDeleteIcon?.removeEventListener('click', this.deleteWishlist);
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

    private deleteWishlist = (evt: Event): void => {
        evt.preventDefault();
        const response = NetworkWishlist.deleteWishlist(this.currentWishlistId);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    this.wishlists.filter((wishlist) => wishlist.wishlist_id !== this.currentWishlistId);
                    Redirector.redirectTo('/wishlist');
                    break;
                case 400:
                    Redirector.redirectError(ERROR_400);
                    break;
                case 403:
                    Redirector.redirectError(ERROR_403);
                    break;
                case 423:
                    Redirector.redirectError(ERROR_ALIEN_WISHLIST);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code || value.error}`);
                    break;
            }
        });
    };
}

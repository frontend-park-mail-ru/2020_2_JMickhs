import WishlistView from '@wishlist/wishlist-view';
import WishlistModel from '@wishlist/wishlist-model';
import Events from '@eventbus/eventbus';
import { FILL_WISHLISTS } from '@eventbus/constants';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';
import Redirector from '@router/redirector';
import type { PageController } from '@interfaces/controllers';

export default class WishlistController implements PageController {
    private view: WishlistView;

    private model: WishlistModel;

    private urlSearchParams: URLSearchParams;

    constructor(place: HTMLElement) {
        this.view = new WishlistView(place);
        this.model = new WishlistModel();
    }

    activate(params?: URLSearchParams): void {
        this.urlSearchParams = params;
        this.subscribeEvents();
        this.model.getWishlistsList();
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }

    subscribeEvents(): void {
        Events.subscribe(FILL_WISHLISTS, this.renderWishlists);
    }

    unsubscribeEvents(): void {
        Events.unsubscribe(FILL_WISHLISTS, this.renderWishlists);
    }

    private renderWishlists = (wishlists: WishlistsStruct[]): void => {
        if (!wishlists) {
            this.view.renderError('У вас пока нет ни одной папки в избранном');
            return;
        }
        this.view.wishlists = wishlists;
        if (!this.urlSearchParams) {
            Redirector.redirectTo(`/wishlist?id=${wishlists[0].wishlist_id}`);
            return;
        }
        this.updateParams(this.urlSearchParams);
    };

    updateParams(params: URLSearchParams): void {
        const id = params.get('id');
        if (id === null) {
            Redirector.redirectTo(`https://hostelscan.ru/wishlist?id=${this.view.wishlists[0].wishlist_id}`);
            return;
        }
        if (!this.haveId(this.view.wishlists, +id)) {
            Redirector.redirectError('Такого списка избранного не существует');
            return;
        }
        this.urlSearchParams = params;
        this.view.render(+id);
        this.model.getWishlist(+id);
    }

    private haveId(arr: WishlistsStruct[], id: number): boolean {
        // eslint-disable-next-line no-restricted-syntax
        for (const elem of arr) {
            if (elem.wishlist_id === id) {
                return true;
            }
        }
        return false;
    }
}

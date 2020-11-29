import NetworkWishlist from '@/helpers/network/network-wishlist';
import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import Events from '@eventbus/eventbus';
import {
    FILL_HOSTELS_WISHLIST,
    FILL_WISHLISTS,
} from '@eventbus/constants';
import Redirector from '@router/redirector';
import type { WishlistsStruct } from '@interfaces/structs-data/wishlists';

export default class WishlistModel {
    private userName: string;

    private isAuth: boolean;

    constructor() {
        this.isAuth = false;
        this.userName = 'Александр Цветков';
    }

    getData(): {isAuth: boolean, username: string} {
        return {
            isAuth: this.isAuth,
            username: this.userName,
        };
    }

    setData(name: string): void {
        this.isAuth = !(name === '');
        this.userName = name;
    }

    getWishlistsList(): void {
        const response = NetworkWishlist.getUserWishlists();

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as {wishlists: WishlistsStruct[]};
                    Events.trigger(FILL_WISHLISTS, data.wishlists);
                    break;
                case 400:
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }

    getWishlist(wishlistId: number): void {
        const response = NetworkWishlist.getWishlist(wishlistId);

        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const hostels = value.data as HostelData[];
                    Events.trigger(FILL_HOSTELS_WISHLIST, hostels);
                    break;
                case 400:
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера - ${code || value.error}`);
                    break;
            }
        });
    }
}

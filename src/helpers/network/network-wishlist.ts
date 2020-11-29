import type { ResponseData } from '@/helpers/network/structs-server/respose-data';
import {
    BACKEND_ADDRESS_HOSTEL,
    BACKEND_ADDRESS_CSRF,
    TEXT_ERROR_CSRF,
} from './constants-network';
import NetworkAbstract from './network-abstract';

class NetworkWishlist extends NetworkAbstract {
    getUserWishlists(): Promise<ResponseData> {
        return this.ajax('GET', '/api/v1/wishlists');
    }

    // createWishlist(wishlistName: string): Promise<ResponseData> {
    // }
    //
    // deleteWishlist(wishlistId: number): Promise<ResponseData> {
    // }

    getWishlist(wishlistId: number): Promise<ResponseData> {
        return this.ajax('GET', `/api/v1/wishlists/${wishlistId}`);
    }
    //
    // addHostelToWishlist(wishlistId: number, hostelId: number): Promise<ResponseData> {
    // }
    //
    // deleteHostelToWishlist(wishlistId: number, hostelId: number): Promise<ResponseData> {
    // }
}

export default new NetworkWishlist(BACKEND_ADDRESS_HOSTEL, BACKEND_ADDRESS_CSRF, TEXT_ERROR_CSRF);

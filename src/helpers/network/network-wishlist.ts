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

    createWishlist(wishlistName: string): Promise<ResponseData> {
        const body = {
            name: wishlistName,
        };
        return this.ajax('POST', '/api/v1/wishlists', body, true);
    }

    deleteWishlist(wishlistId: number): Promise<ResponseData> {
        return this.ajax('DELETE', `/api/v1/wishlists/${wishlistId}`, undefined, true);
    }

    getWishlist(wishlistId: number): Promise<ResponseData> {
        return this.ajax('GET', `/api/v1/wishlists/${wishlistId}`);
    }

    addHostelToWishlist(wishlistId: number, hostelId: number): Promise<ResponseData> {
        const body = {
            hotel_id: hostelId,
        };
        return this.ajax('POST', `/api/v1/wishlists/${wishlistId}/hotels`, body, true);
    }

    deleteHostelFromWishlist(wishlistId: number, hostelId: number): Promise<ResponseData> {
        const body = {
            hotel_id: hostelId,
        };
        return this.ajax('DELETE', `/api/v1/wishlists/${wishlistId}/hotels`, body, true);
    }
}

export default new NetworkWishlist(BACKEND_ADDRESS_HOSTEL, BACKEND_ADDRESS_CSRF, TEXT_ERROR_CSRF);

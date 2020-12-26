import type { ResponseData } from '@/helpers/network/structs-server/respose-data';
import {
    BACKEND_ADDRESS,
    TEXT_ERROR_CSRF,
} from './constants-network';
import NetworkAbtract from './network-abstract';

class NetworkHostel extends NetworkAbtract {
    getHostels(): Promise<ResponseData> {
        return this.ajax('GET', '/api/v1/hotels?from=0');
    }

    getHostel(id: number): Promise<ResponseData> {
        return this.ajax('GET', `/api/v1/hotels/${id}`);
    }

    addComment(idHostel: number, message: string, rate: number, photos: FileList): Promise<ResponseData> {
        const jsonData = {
            hotel_id: idHostel,
            message,
            rating: rate,
        };

        const body = new FormData();
        for (let i = 0; i < photos.length; i += 1) {
            body.append('photos', photos[i]);
        }
        body.append('jsonData', JSON.stringify(jsonData));
        return this.ajax('POST', '/api/v1/comments', body, true);
    }

    searchHostel(searchParams: string): Promise<ResponseData> {
        return this.ajax('GET', `/api/v1/hotels/search${searchParams}`);
    }

    editComment(idComment: number,
        message: string,
        rating: number,
        delele: boolean,
        photos: FileList): Promise<ResponseData> {
        const comment = {
            comm_id: idComment,
            message,
            rating,
        };
        const jsonData = {
            comment,
            delete: delele,
        };
        const body = new FormData();
        body.append('jsonData', JSON.stringify(jsonData));
        for (let i = 0; i < photos.length; i += 1) {
            body.append('photos', photos[i]);
        }

        return this.ajax('PUT', '/api/v1/comments', body, true);
    }

    getComments(offset: number, limit: number, idHostel: number): Promise<ResponseData> {
        const searchParams = new URLSearchParams('');
        searchParams.set('offset', offset.toString());
        searchParams.set('limit', limit.toString());
        searchParams.set('id', idHostel.toString());

        const url = `/api/v1/comments?${searchParams}`;
        return this.ajax('GET', url);
    }

    getCommentsFromUrl(url: string): Promise<ResponseData> {
        return this.ajax('GET', url);
    }

    getRecommendedHostels(): Promise<ResponseData> {
        return this.ajax('GET', '/api/v1/hotels/recommendations');
    }

    getAlbum(idHostel: number): Promise<ResponseData> {
        const searchParams = new URLSearchParams('');
        searchParams.set('id', idHostel.toString());
        const url = `/api/v1/comments/photos?${searchParams}`;
        return this.ajax('GET', url);
    }

    getHostelsByRadius(radius: number, latitude: number, longitude: number): Promise<ResponseData> {
        const searchParams = new URLSearchParams('');
        searchParams.set('radius', radius.toString());
        searchParams.set('latitude', latitude.toString());
        searchParams.set('longitude', longitude.toString());
        const url = `/api/v1/hotels/radiusSearch?${searchParams}`;
        return this.ajax('GET', url);
    }
}

export default new NetworkHostel(BACKEND_ADDRESS, TEXT_ERROR_CSRF);

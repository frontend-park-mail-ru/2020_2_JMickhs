import type { ResponseData } from '@/helpers/network/structs-server/respose-data';
import NetworkAbtract from './network-abtract';

class NetworkHostel extends NetworkAbtract {
    constructor() {
        super('https://hostelscan.ru', ':8080');
    }

    getHostels(): Promise<ResponseData> {
        return this.ajax('GET', '/api/v1/hotels?from=0');
    }

    getHostel(id: number): Promise<ResponseData> {
        return this.ajax('GET', `/api/v1/hotels/${id}`);
    }

    addComment(idHostel: number, message: string, rate: number): Promise<ResponseData> {
        const body = {
            hotel_id: idHostel,
            message,
            rating: rate,
        };

        return this.ajax('POST', '/api/v1/comments', body, true);
    }

    searchHostel(pattern: string, page = 0): Promise<ResponseData> {
        return this.ajax('GET', `/api/v1/hotels/search?pattern=${pattern}&page=${page}`);
    }

    editComment(idComment: number, message: string, rating: number): Promise<ResponseData> {
        const body = {
            comm_id: idComment,
            message,
            rating,
        };

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
}

export default new NetworkHostel();

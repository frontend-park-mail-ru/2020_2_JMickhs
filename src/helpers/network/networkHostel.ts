import Request from '@network/request';
import { ResponseData } from '@/helpers/network/structsServer/resposeData';

class NetworkHostel {
    static getHostels(): Promise<ResponseData> {
        return Request.ajax('GET', '/api/v1/hotels?from=0');
    }

    static getHostel(id: number): Promise<ResponseData> {
        return Request.ajax('GET', `/api/v1/hotels/${id}`);
    }

    static addComment(idHostel: number, message: string, rate: number): Promise<ResponseData> {
        const body = {
            hotel_id: idHostel,
            message,
            rating: rate,
        };

        return Request.ajax('POST', '/api/v1/comments', body, true);
    }

    static searchHostel(pattern: string, page = 0): Promise<ResponseData> {
        return Request.ajax('GET', `/api/v1/hotels/search?pattern=${pattern}&page=${page}`);
    }

    static editComment(idComment: number, message: string, rating: number): Promise<ResponseData> {
        const body = {
            comm_id: idComment,
            message,
            rating,
        };

        return Request.ajax('PUT', '/api/v1/comments', body, true);
    }

    static getComments(page: number, idHostel: number): Promise<ResponseData> {
        const url = new URL('http://www.hostelscan.ru/api/v1/comments');
        url.searchParams.set('page', page.toString());
        url.searchParams.set('id', idHostel.toString());
        const urlStr = url.pathname + url.search;

        return Request.ajax('GET', urlStr);
    }
}

export default NetworkHostel;

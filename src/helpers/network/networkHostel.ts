import Request from '@network/request';

class NetworkHostel {

    getHostels() {
        return Request.ajax('GET', '/api/v1/hotels?from=0');
    }

    getHostel(id: number) {
        return Request.ajax('GET', `/api/v1/hotels/${id}`);
    }

    addComment(idHostel: number, message: string, rate: number) {
        const body = {
            hotel_id: idHostel,
            message: message,
            rating: rate,
        };

        return Request.ajax('POST', '/api/v1/comments', body, true);
    }

    editComment(idComment: number, message: string, rating: number) {
        const body = {
            comm_id: idComment,
            message: message,
            rating: rating,
        };

        return Request.ajax('PUT', '/api/v1/comments', body, true);
    }

    getComments(page: number, idHostel: number) {
        const url = new URL('http://www.hostelscan.ru/api/v1/comments');
        url.searchParams.set('page', page.toString());
        url.searchParams.set('id', idHostel.toString());
        const urlStr = url.pathname + url.search;

        return Request.ajax('GET', urlStr);
    }

}

export default new NetworkHostel();
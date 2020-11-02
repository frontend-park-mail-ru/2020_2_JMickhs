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

}

export default new NetworkHostel();
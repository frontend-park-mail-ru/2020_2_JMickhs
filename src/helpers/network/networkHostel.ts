import Request from '@network/request';

class NetworkHostel {
    getHostels() {
        return Request.ajax('GET', '/api/v1/hotels?from=0');
    }

    getHostel(id: number) {
        return Request.ajax('GET', `/api/v1/hotels/${id}`);
    }
}

export default new NetworkHostel();
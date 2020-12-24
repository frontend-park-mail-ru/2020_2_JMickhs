import NetworkAbstract from '@network/network-abstract';
import type { ResponseData } from '@network/structs-server/respose-data';
import {
    BACKEND_ADDRESS,
    TEXT_ERROR_CSRF,
} from '@network/constants-network';

class NetworkChat extends NetworkAbstract {
    getHistory(urlSearchParams?: URLSearchParams): Promise<ResponseData> {
        if (urlSearchParams) {
            return this.ajax('GET', `/api/v1/chat/history?${urlSearchParams.toString()}`);
        }
        return this.ajax('GET', '/api/v1/chat/history');
    }
}

export default new NetworkChat(BACKEND_ADDRESS, TEXT_ERROR_CSRF);

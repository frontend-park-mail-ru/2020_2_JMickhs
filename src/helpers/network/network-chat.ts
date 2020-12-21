import NetworkAbstract from '@network/network-abstract';
import type { ResponseData } from '@network/structs-server/respose-data';
import {
    BACKEND_ADDRESS_CSRF,
    BACKEND_ADDRESS_HOSTEL,
    TEXT_ERROR_CSRF,
} from '@network/constants-network';

class NetworkChat extends NetworkAbstract {
    getHistory(): Promise<ResponseData> {
        return this.ajax('GET', '/api/v1/ws/chat/history');
    }
}

export default new NetworkChat(BACKEND_ADDRESS_HOSTEL, BACKEND_ADDRESS_CSRF, TEXT_ERROR_CSRF);

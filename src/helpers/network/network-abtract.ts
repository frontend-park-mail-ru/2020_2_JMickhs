// Почему быстрейшие марафонцы это бэкендеры?
// На финише дают еду =)

import Request from '@network/request';
import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

export default class NetworkAbtract {
    private readonly domain: string;

    private readonly port: string;

    private request: typeof Request;

    constructor(domain: string, port: string) {
        this.domain = domain;
        this.port = port;

        this.request = Request;
    }

    private urlAbsolute(urlRelative: string): string {
        return this.domain + this.port + urlRelative;
    }

    protected ajax(method: string,
        url: string,
        body?: unknown,
        csrf?: boolean,
        headers?: Record<string, string>): Promise<ResponseData> {
        return this.request.ajax(
            method,
            this.urlAbsolute(url),
            body,
            csrf,
            headers,
        );
    }
}

// Почему быстрейшие марафонцы это бэкендеры?
// На финише дают еду =)

import Request from '@network/request';
import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

export default class NetworkAbstract {
    private readonly address: string;

    private readonly addressCSRF: string;

    private readonly errorCSRF: string;

    private request: typeof Request;

    constructor(address: string, addressCSRF: string, errorCSRF: string) {
        this.address = address;
        this.addressCSRF = addressCSRF;
        this.errorCSRF = errorCSRF;

        this.request = Request;
    }

    protected ajax(method: string,
        url: string,
        body?: unknown,
        csrf?: boolean,
        headers?: Record<string, string>): Promise<ResponseData> {
        let reqHeaders = headers;
        const urlAbsolute = this.address + url;
        if (csrf) {
            return this.getToken().then((value: string) => {
                // добавляем в хедеры токен
                if (!reqHeaders) {
                    reqHeaders = {};
                }
                reqHeaders['X-Csrf-Token'] = value;
                // и после получения токена и добавления в хедеры уже делаем запрос
                return this.request.ajax(method, urlAbsolute, body, reqHeaders);
            }).catch((err: string) => ({ error: err }));
        }

        return this.request.ajax(
            method,
            urlAbsolute,
            body,
            headers,
        );
    }

    private getToken(): Promise<string> {
        const url = `${this.addressCSRF}/api/v1/csrf`;
        let token = '';

        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then((response) => {
            token = response.headers.get('csrf');
            return response.json();
        }).then((json) => json.code).then((code) => {
            if (code !== 200) {
                return Promise.reject();
            }
            return token;
        }).catch(() => Promise.reject(this.errorCSRF));
    }
}

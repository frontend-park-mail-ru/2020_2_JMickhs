// Почему быстрейшие марафонцы это бэкендеры?
// На финише дают еду =)

import Request from '@network/request';
import type { ResponseData } from '@/helpers/network/structs-server/respose-data';
import { BACKEND_DOMAIN, BACKEND_PORT_CSRF, TEXT_ERROR_CSRF } from './constants-network';

class LoaderCSRF {
    private static readonly domainCSRF = BACKEND_DOMAIN;

    private static readonly portCSRF = BACKEND_PORT_CSRF;

    private static readonly errorCSRF = TEXT_ERROR_CSRF;

    static getToken(): Promise<string> {
        const url = `${this.domainCSRF + this.portCSRF}/api/v1/csrf`;
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
                return Promise.reject(new Error(this.errorCSRF));
            }
            return token;
        }).catch((err) => err);
    }
}

export default class NetworkAbstract {
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
        let reqHeaders = headers;
        const urlAbsolute = this.urlAbsolute(url);
        if (csrf) {
            return LoaderCSRF.getToken().then((value: string) => {
                // добавляем в хедеры токен
                if (!reqHeaders) {
                    reqHeaders = {};
                }
                reqHeaders['X-Csrf-Token'] = value;
                // и после получения токена и добавления в хедеры уже делаем запрос
                return this.request.ajax(method, urlAbsolute, body, reqHeaders);
            }).catch((err: Error) => ({ error: err }));
        }

        return this.request.ajax(
            method,
            urlAbsolute,
            body,
            headers,
        );
    }
}

import type { ResponseData } from '@/helpers/network/structs-server/respose-data';
import {
    BACKEND_DOMAIN,
    BACKEND_PORT_CSRF,
    TEXT_ERROR_CSRF,
    METHOD_GET,
} from './constants-network';

class Request {
    private readonly domainCSRF: string;

    private readonly portCSRF: string;

    private readonly errorCSRF: string;

    constructor(domainCSRF: string, portCSRF: string, errorSCRF: string) {
        this.domainCSRF = domainCSRF;
        this.portCSRF = portCSRF;
        this.errorCSRF = errorSCRF;
    }

    private customFetch(url: string, method: string, body?: BodyInit, headers?: HeadersInit): Promise<ResponseData> {
        return fetch(url, {
            method,
            mode: 'cors',
            credentials: 'include',
            body,
            headers,
        }).then((response) => response.json()).then((json) => ({
            code: json.code,
            data: json.data,
        })).catch((err) => ({
            error: err,
        }));
    }

    ajax(method: string,
        url: string,
        body?: unknown,
        csrf?: boolean,
        headers?: Record<string, string>): Promise<ResponseData> {
        let reqBody: BodyInit;

        if (body instanceof FormData) {
            reqBody = body;
        }

        if (body && !(body instanceof FormData)) {
            try {
                reqBody = JSON.stringify(body);
            } catch (err) {
                return Promise.reject(err).catch((e) => ({ error: e }));
            }
        }

        let reqHeaders = headers;

        if (csrf) {
            return this.getToken().then((value: string) => {
                // добавляем в хедеры токен
                if (!reqHeaders) {
                    reqHeaders = {};
                }
                reqHeaders['X-Csrf-Token'] = value;
                // и после получения токена и добавления в хедеры уже делаем запрос
                return this.customFetch(url, method, reqBody, reqHeaders);
            }).catch((err) => ({ error: err }));
        }

        return this.customFetch(url, method, reqBody, reqHeaders);
    }

    private getToken(): Promise<string> {
        const url = `${this.domainCSRF + this.portCSRF}/api/v1/csrf`;
        let token = '';

        return fetch(url, {
            method: METHOD_GET,
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
        }).catch(() => this.errorCSRF);
    }
}

export default new Request(BACKEND_DOMAIN, BACKEND_PORT_CSRF, TEXT_ERROR_CSRF);

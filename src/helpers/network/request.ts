import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

class Request {
    private readonly domain: string;

    private readonly port: string;

    constructor() {
        this.domain = 'https://hostelscan.ru';
        this.port = ':8080';
    }

    async ajax(method: string,
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
            const token = await this.getToken();
            if (reqHeaders) {
                reqHeaders['X-Csrf-Token'] = token;
            } else {
                reqHeaders = {
                    'X-Csrf-Token': token,
                };
            }
        }

        return fetch(this.domain + this.port + url, {
            method,
            mode: 'cors',
            credentials: 'include',
            body: reqBody,
            headers: reqHeaders,
        }).then((response) => response.json()).then((json) => ({
            code: json.code,
            data: json.data,
        })).catch((err) => ({
            error: err,
        }));
    }

    private getToken(): Promise<string> {
        const url = '/api/v1/csrf';

        let token = '';

        return fetch(this.domain + this.port + url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then((response) => {
            token = response.headers.get('csrf');
            return response.json();
        }).then((json) => json.code).then((code) => {
            if (code !== 200) {
                return '';
            }
            return token;
        }).catch(() => '');
    }
}

export default new Request();

import { ResponseData } from '@/helpers/network/structsServer/resposeData';

class Request {
    private domain: string;

    private port: string;

    private token: string;

    constructor() {
        this.domain = 'https://hostelscan.ru';
        this.port = ':8080';

        this.token = '';
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
            if (reqHeaders) {
                reqHeaders['X-Csrf-Token'] = this.token;
            } else {
                reqHeaders = {
                    'X-Csrf-Token': this.token,
                };
            }
        }

        return fetch(this.domain + this.port + url, {
            method,
            mode: 'cors',
            credentials: 'include',
            body: reqBody,
            headers: reqHeaders,
        }).then((response) => {
            this.token = response.headers.get('csrf');
            return response.json();
        }).then((json) => ({ code: json.code, data: json.data })).catch((err) => ({ error: err }));
    }
}

export default new Request();

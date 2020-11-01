interface ResponseData {
    code?: number;
    error?: unknown;
    data?: unknown;
}

class Request {

    private domain: string;
    private port: string;

    private token: string;

    constructor() {
        this.domain = 'http://www.hostelscan.ru';
        this.port = ':8080';

        this.token = '';
    }

    ajax(method: string,
        url: string,
        body?: unknown, 
        csrf?: boolean,
        headers?: Record<string, string>
    ): Promise<ResponseData> {
        let reqBody: BodyInit;

        if (body instanceof FormData) {
            reqBody = body;
        }

        if (body && !(body instanceof FormData)) {
            try {
                reqBody = JSON.stringify(body);
            } catch (err) {
                return Promise.reject(err).catch((e) => {
                    return {error: e};
                });
            }
        }

        if (csrf) {
            if (headers) {
                headers['X-Csrf-Token'] = this.token;
            } else {
                headers = {
                    'X-Csrf-Token': this.token
                };
            } 
        }

        return fetch(this.domain + this.port + url, {
            method: method,
            mode: 'cors',
            credentials: 'include',
            body: reqBody,
            headers: headers,
        }).then((response) => {
            this.token = response.headers.get('csrf');
            return response.json();
        }).then((json) => {
            return { code: json.code, data: json.data };
        }).catch((err) => {
            return { error: err };
        });

    }
}

export default new Request();
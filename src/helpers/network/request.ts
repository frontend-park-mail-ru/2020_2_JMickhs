import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

class Request {
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

        return this.customFetch(url, method, reqBody, headers);
    }
}

export default new Request();

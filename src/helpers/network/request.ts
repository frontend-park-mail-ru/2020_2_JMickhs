import type { ResponseData } from '@/helpers/network/structs-server/respose-data';

class Request {
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

    private getToken(): Promise<string> {
        const url = 'https://hostelscan.ru:8082/api/v1/csrf';
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
        }).catch(() => 'Нет прав доступа');
    }
}

export default new Request();

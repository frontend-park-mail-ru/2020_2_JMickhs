/** Класс для работы с сетью */
class Network {
    /**
     * @return {string} Возвращает домен удаленного сервера
     */
    get domain() {
        return 'http://www.hostelscan.ru';
    }
    /**
     * @return {string} Возвращает порт удаленного сервера
     */
    get port() {
        return ':8080';
    }
    /**
     * универсальный модуль request
     * @param {string} method
     * @param {string} url
     * @param {Object|FormData} body
     * @param {Object.<string, string>} headers
     * @return {Promise}
     */
    _ajax(method, url, body = null, headers = {}) {
        let reqBody = body;
        if (body != null && !(body instanceof FormData)) {
            try {
                reqBody = JSON.stringify(body);
            } catch (err) {
                return Promise.reject(err).catch((e) => {
                    return {error: e};
                });
            }
        }

        return fetch(this.domain + this.port + url, {
            method: method,
            mode: 'cors',
            credentials: 'include',
            body: reqBody,
            headers: headers,
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            return response.json();
        }).then((json) => {
            return {code: json.code, data: json.data};
        }).catch((err) => {
            return {error: err};
        });
    }
    /**
     * получение пользователя по кукам
     * @return {Promise}
     */
    user() {
        return this._ajax('GET', '/api/v1/users');
    }
    /**
     * вход пользователя
     * @param {string} username - логин
     * @param {string} password - пароль
     * @return {Promise}
     */
    signin(username, password) {
        const body = {
            username: username,
            password: password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this._ajax('POST', '/api/v1/users/sessions', body, headers);
    }
    /**
     * Регистрация пользователя
     * @param {string} username - логин
     * @param {string} email - email
     * @param {string} password - пароль
     * @return {Promise}
     */
    signup(username, email, password) {
        const body = {
            email: email,
            username: username,
            password: password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this._ajax('POST', '/api/v1/users', body, headers);
    }
    /**
     * Получение всех отелей
     * @return {Promise}
     */
    getHostels() {
        return this._ajax('GET', '/api/v1/hotels?from=0');
    }
    /**
     * Получение определнных отелей
     * @param {number} id - id отеля
     * @return {Promise<{code: number, data: {hotel: any}}>}
     * number - statusCode, json - ответ
     */
    getHostel(id) {
        return this._ajax('GET', `/api/v1/hotels/${id}`);
    }
    /**
     * Обновление пароля
     * @param {string} oldPassword - старый пароль
     * @param {string} password - новый пароль
     * @return {Promise}
     */
    updatePassword(oldPassword, password) {
        const body = {
            newpassword: password,
            oldpassword: oldPassword,
        };
        const headers = {
            'X-Csrf-Token': this._csrf,
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this._ajax('PUT', '/api/v1/users/password', body, headers);
    }
    /**
     * Выход из аккаунта
     * @return {Promise} Возвращает статус ответа или ошибку
     */
    signout() {
        return this._ajax('DELETE', '/api/v1/users/sessions');
    }
    /**
     * Обновление аватара
     * @param {FormData} formData - Форма с картинкой, имя у которой avatar
     * @return {Promise} Возвращает статус ответа или ошибку
     */
    updateAvatar(formData) {
        const headers = {
            'X-Csrf-Token': this._csrf,
        };
        return this._ajax('PUT', '/api/v1/users/avatar', formData, headers);
    }
    /**
     * Обновление информации о пользователе
     * @param {string} username - логин
     * @param {string} email - email
     * @return {Promise} Возвращает статус ответа или ошибку
     */
    changeUser(username, email) {
        const body = {
            email: email,
            username: username,
        };
        const headers = {
            'X-Csrf-Token': this._csrf,
        };
        return this._ajax('PUT', '/api/v1/users/credentials', body, headers);
    }
}

export default new Network();

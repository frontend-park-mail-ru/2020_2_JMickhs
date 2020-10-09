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
     * @param {string} path - Относительный путь
     * @return {string} Возвращает адресс файла
     */
    getUrlFile(path) {
        return this.domain + this.port + '/' + path;
    }
    /**
     * универсальный модуль request
     * @param {string} method
     * @param {string} url
     * @param {Object} body
     * @param {Object.<string, string>} headers
     * @return {Promise}
     */
    _ajax(method, url, body = null, headers = {}) {
        let json = null;
        if (body != null) {
            json = JSON.stringify(body); // TODO: сделать проверку
        }
        let statusCode = -1;
        return fetch(this.domain + this.port + url, {
            method: method,
            mode: 'cors',
            credentials: 'include',
            body: json,
            headers: headers,
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            statusCode = response.status;
            return response.json();
        }).then((json) => {
            return {status: statusCode, data: json.data, error: json.error};
        }).catch((err) => {
            return {status: statusCode, error: err};
        });
    }
    /**
     * получение пользователя по кукам
     * @return {Promise}
     */
    user() {
        return this._ajax('GET', '/api/v1/user');
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
        return this._ajax('POST', '/api/v1/user/signin', body, headers);
    }
    /**
     * вход пользователя
     * @param {string} username - логин
     * @param {string} password - пароль
     * @return {Promise}
     */
    signup(username, password) {
        const body = {
            username: username,
            password: password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this._ajax('POST', '/api/v1/user/signup', body, headers);
    }
    /**
     * Получение всех отелей
     * @return {Promise}
     */
    getHostels() {
        return this._ajax('GET', '/api/v1/hotel?from=0');
    }
    /**
     * Получение определнных отелей
     * @param {number} id - id отеля
     * @return {Promise<{number, json}|{number, Error}>}
     * number - statusCode, json - ответ
     */
    getHostel(id) {
        return this._ajax('GET', `/api/v1/hotel/${id}`);
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
        return this._ajax('PUT', '/api/v1/user/password', body, headers);
    }
    /**
     * Выход из аккаунта
     * @return {Promise} Возвращает статус ответа или ошибку
     */
    signout() {
        return this._ajax('POST', '/api/v1/user/signout');
    }
    /**
     * Обновление аватара
     * @param {FormData} formData - Форма с картинкой, имя у которой avatar
     * @return {Promise} Возвращает статус ответа или ошибку
     */
    updateAvatar(formData) {
        console.log(formData);
        const headers = {
            'X-Csrf-Token': this._csrf,
        };
        return this._ajax('PUT', '/api/v1/user/avatar', formData, headers);
    }
}

const Net = new Network;
export default Net;

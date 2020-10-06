export default class Net {
    static get domen() {
        return 'http://www.hostelscan.ru';
    }
    static get port() {
        return ':8080';
    }
    static getUrlFile(path) {
        return this.domen + this.port + '/' + path;
    }
    static signout() {
        return fetch(this.domen + this.port + '/api/v1/signout', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': this._csrf
            },
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            return response.status;
        }).catch(err => {
            return err;
        });
    }
    static updateAvatar(data) {
        let statusCode = -1;
        return fetch(this.domen + this.port + '/api/v1/updateAvatar', {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': this._csrf
            },
            body: data
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            statusCode = response.status;
            return statusCode;
        }).catch(err => {
            return err;
        });
    }
    static getCurrUser() {
        let statusCode = -1;
        return fetch(this.domen + this.port + '/api/v1/get_current_user', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            statusCode = response.status;
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }

    static signin(username, password) {
        let statusCode = -1;
        let json;
        try {
            json = JSON.stringify({
                username: username,
                password: password
            });
        } catch (err) {
            return Promise.reject({ status: statusCode, error: err });
        }

        return fetch(this.domen + this.port + '/api/v1/signin', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json,
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            statusCode = response.status;
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }
    static signup(username, password) {
        let statusCode = -1;
        let json;
        try {
            json = JSON.stringify({
                username: username,
                password: password
            });
        } catch (err) {
            return Promise.reject({ status: statusCode, error: err });
        }

        return fetch(this.domen + this.port + '/api/v1/signup', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json,
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            statusCode = response.status;
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }
    static getHotels() {
        let statusCode = -1;
        return fetch(this.domen + this.port + '/api/v1/hotels', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then((response) => {
            statusCode = response.status;
            this._csrf = response.headers.get('csrf');
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }

    static updatePassword(oldPassword, password) {
        let statusCode = -1;
        let json;
        try {
            json = JSON.stringify({
                newpassword: password,
                oldpassword: oldPassword,
            });
        } catch (err) {
            return Promise.reject({ status: statusCode, error: err });
        }

        return fetch(this.domen + this.port + '/api/v1/updatePassword', {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': this._csrf,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json,
        }).then((response) => {
            this._csrf = response.headers.get('csrf');
            statusCode = response.status;
            return statusCode;
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }
    static getHostel(id) {
        let statusCode = -1;
        return fetch(this.domen + this.port + `/api/v1/hotel/${id}`, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then((response) => {
            statusCode = response.status;
            this._csrf = response.headers.get('csrf');
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }
}

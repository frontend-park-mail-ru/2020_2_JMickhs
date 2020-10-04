export default class Net {
    static get domen() {
        return 'http://www.hostelscan.ru';
    }
    static get port() {
        return ':8080';
    }
    static getUrlImage(path) {
        return this.domen + this.port + '/' + path;
    }

    static updateAvatar(data) {
        let statusCode = -1;
        console.log(sessionStorage.getItem('csrf'), 'csf');
        return fetch(this.domen + this.port + '/api/v1/updateAvatar', {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': sessionStorage.getItem('csrf')
            },
            body: data
        }).then((response) => {
            let csrf = response.headers.get('csrf');
            sessionStorage.setItem('csrf', csrf);
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
            let csrf = response.headers.get('csrf');
            sessionStorage.setItem('csrf', csrf);
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
            let csrf = response.headers.get('csrf');
            sessionStorage.setItem('csrf', csrf);
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
            let csrf = response.headers.get('csrf');
            sessionStorage.setItem('csrf', csrf);
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
            let csrf = response.headers.get('csrf');
            sessionStorage.setItem('csrf', csrf);
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }

    static updatePassword(id, password) {
        let statusCode = -1;
        let json;
        try {
            json = JSON.stringify({
                id: id,
                password: password
            });
        } catch (err) {
            return Promise.reject({ status: statusCode, error: err });
        }

        return fetch(this.domen + this.port + '/api/v1/updatePassword', {
            method: 'PUT',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'X-Csrf-Token': sessionStorage.getItem('csrf'),
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: json,
        }).then((response) => {
            let csrf = response.headers.get('csrf');
            sessionStorage.setItem('csrf', csrf);
            statusCode = response.status;
            return statusCode;
        }).catch(err => {
            return { status: statusCode, error: err };
        });
    }
}

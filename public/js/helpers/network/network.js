export default class Net {
    static get domen() {
        return 'http://www.hostelscan.ru';
    }
    static get port() {
        return ':8080';
    }
    static getCurrUser() {
        let statusCode;
        return fetch(this.domen + this.port + '/api/v1/get_current_user', {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }).then((response) => {
            statusCode = response.status;
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        })
    }
    static signin(username, password) {
        return fetch(this.domen + this.port + '/api/v1/signin', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }).then((response) => {
            return response.status;
        });
    }
    static signup(username, password) {
        return fetch(this.domen + this.port + '/api/v1/signup', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }).then((response) => {
            return response.status;
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
            return response.json();
        }).then((json) => {
            return { status: statusCode, body: json };
        }).catch(err => {
            return { status: statusCode, error: err };
        })
    }
}

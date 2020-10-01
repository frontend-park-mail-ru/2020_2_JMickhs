

export default class Net {

    static getCurrUser() {
        let statusCode;
        return fetch('http://www.hostelscan.ru:8080/api/v1/get_current_user', {
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
        return fetch('http://www.hostelscan.ru:8080/api/v1/signin', {
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
}

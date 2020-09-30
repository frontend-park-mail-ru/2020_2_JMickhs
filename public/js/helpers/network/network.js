import ajax from './ajax'

export default class Network {

    static signup(username = '', password = '', callback) {
        ajax(
            'POST',
            'http://89.208.197.127:8080/api/v1/signup', { username, password },
            callback,
        )
    }

    static signin(username = '', password = '', callback) {
        ajax(
            'POST',
            'http://89.208.197.127:8080/api/v1/signup', { username, password },
            callback,
        )
    }

    static checkCookie(callback) {
        ajax(
            'GET',
            'http://89.208.197.127:8080/api/v1/get_current_user',
            null,
            callback,
        )
    }
}
import ajax from './ajax'

class Network {

    noop = () => {};
    constructor() {}

    signup(username = '', password = '', callback = this.noop) {

    }
    signin(username = '', password = '', callback = this.noop) {
        ajax(
            'POST',
            'http://89.208.197.127:8080/api/v1/signup', { username, password },
            callback
        )
    }
}
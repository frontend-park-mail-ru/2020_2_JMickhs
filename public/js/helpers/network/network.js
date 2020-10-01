

export default class Net {
    static signin(username, password) {
        return fetch('http://89.208.197.127:8080/api/v1/signup', {
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


// export  class Network {

//     static signup(username = '', password = '', callback) {
//         ajax(
//             'POST',
//             'http://89.208.197.127:8080/api/v1/signup', { username, password },
//             callback,
//         )
//     }

//     static signin(username = '', password = '', callback) {
//         ajax(
//             'POST',
//             'http://89.208.197.127:8080/api/v1/signup', { username, password },
//             callback,
//         )
//     }

//     static checkCookie(callback) {
//         ajax(
//             'GET',
//             'http://89.208.197.127:8080/api/v1/get_current_user',
//             null,
//             callback,
//         )
//     }
// }
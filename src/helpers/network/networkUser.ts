import Request from '@network/request';

class NetworkUser {

    user() {
        return Request.ajax('GET', '/api/v1/users');
    }

    signin(username: string, password: string) {
        const body = {
            username: username,
            password: password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return Request.ajax('POST', '/api/v1/users/sessions', body, false, headers);
    }

    signup(username: string, email: string, password: string) {
        const body = {
            email: email,
            username: username,
            password: password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return Request.ajax('POST', '/api/v1/users', body, false, headers);
    }

    updatePassword(oldPassword: string, password: string) {
        const body = {
            newpassword: password,
            oldpassword: oldPassword,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return Request.ajax('PUT', '/api/v1/users/password', body, true, headers);
    }

    signout() {
        return Request.ajax('DELETE', '/api/v1/users/sessions');
    }

    updateAvatar(formData: FormData) {
        return Request.ajax('PUT', '/api/v1/users/avatar', formData, true);
    }

    changeUser(username: string, email: string) {
        const body = {
            email: email,
            username: username,
        };

        return Request.ajax('PUT', '/api/v1/users/credentials', body, true);
    }
}

export default new NetworkUser();

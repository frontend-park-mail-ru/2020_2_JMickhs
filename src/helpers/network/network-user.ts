import Request from '@network/request';
import { ResponseData } from '@/helpers/network/structs-server/respose-data';

class NetworkUser {
    static user(): Promise<ResponseData> {
        return Request.ajax('GET', '/api/v1/users');
    }

    static signin(username: string, password: string): Promise<ResponseData> {
        const body = {
            username,
            password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return Request.ajax('POST', '/api/v1/users/sessions', body, false, headers);
    }

    static signup(username: string, email: string, password: string): Promise<ResponseData> {
        const body = {
            email,
            username,
            password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return Request.ajax('POST', '/api/v1/users', body, false, headers);
    }

    static updatePassword(oldPassword: string, password: string): Promise<ResponseData> {
        const body = {
            newpassword: password,
            oldpassword: oldPassword,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return Request.ajax('PUT', '/api/v1/users/password', body, true, headers);
    }

    static signout(): Promise<ResponseData> {
        return Request.ajax('DELETE', '/api/v1/users/sessions');
    }

    static updateAvatar(formData: FormData): Promise<ResponseData> {
        return Request.ajax('PUT', '/api/v1/users/avatar', formData, true);
    }

    static changeUser(username: string, email: string): Promise<ResponseData> {
        const body = {
            email,
            username,
        };

        return Request.ajax('PUT', '/api/v1/users/credentials', body, true);
    }
}

export default NetworkUser;

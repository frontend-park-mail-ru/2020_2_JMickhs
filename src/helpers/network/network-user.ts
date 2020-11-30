import type { ResponseData } from '@/helpers/network/structs-server/respose-data';
import {
    BACKEND_ADDRESS_USER,
    BACKEND_ADDRESS_CSRF,
    TEXT_ERROR_CSRF,
} from './constants-network';
import NetworkAbtract from './network-abstract';

class NetworkUser extends NetworkAbtract {
    user(): Promise<ResponseData> {
        return this.ajax('GET', '/api/v1/users');
    }

    signin(username: string, password: string): Promise<ResponseData> {
        const body = {
            username,
            password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this.ajax('POST', '/api/v1/users/sessions', body, false, headers);
    }

    signup(username: string, email: string, password: string): Promise<ResponseData> {
        const body = {
            email,
            username,
            password,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this.ajax('POST', '/api/v1/users', body, false, headers);
    }

    updatePassword(oldPassword: string, password: string): Promise<ResponseData> {
        const body = {
            newpassword: password,
            oldpassword: oldPassword,
        };
        const headers = {
            'Content-Type': 'application/json;charset=utf-8',
        };
        return this.ajax('PUT', '/api/v1/users/password', body, true, headers);
    }

    signout(): Promise<ResponseData> {
        return this.ajax('DELETE', '/api/v1/users/sessions');
    }

    updateAvatar(formData: FormData): Promise<ResponseData> {
        return this.ajax('PUT', '/api/v1/users/avatar', formData, true);
    }

    changeUser(username: string, email: string): Promise<ResponseData> {
        const body = {
            email,
            username,
        };

        return this.ajax('PUT', '/api/v1/users/credentials', body, true);
    }
}

export default new NetworkUser(BACKEND_ADDRESS_USER, BACKEND_ADDRESS_CSRF, TEXT_ERROR_CSRF);

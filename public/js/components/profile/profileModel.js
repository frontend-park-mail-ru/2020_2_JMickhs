import Net from '../../helpers/network/network';

class UserModel {
    constructor() {
        this.login = '';
        this.id = -1;
        this.isAuth = false;
        this.avatar = '';
    }
    getCurrUser() {
        let response = Net.getCurrUser();
        response.then((response) => {
            let status = response.status;
            let body = response.body;
            if (status === 200) {
                this.isAuth = true;
                this.login = body.username;
                this.id = body.id;
                this.avatar = body.avatar;
                EventBus.trigger('updateUser');
                EventBus.trigger('profileUser');
            } else {
                EventBus.trigger('haventUser');
            }
        });
    }
    signin(username, password) {
        let response = Net.signin(username, password);
        response.then((response) => {
            let status = response.status;
            const body = response.body;
            if (status === 200) {
                this.id = body.id;
                this.avatar = body.avatar;
                this.isAuth = true;
                this.login = username;
            }
            EventBus.trigger('updateUser');
            EventBus.trigger('signinUser');
        }).catch(err => {
            EventBus.trigger('errorSignup');
        });
    }
    signup(username, password) {
        let response = Net.signup(username, password);
        response.then((response) => {
            let status = response.status;
            const body = response.body;
            if (status === 200) {
                this.id = body.id;
                this.avatar = body.avatar;
                this.isAuth = true;
                this.login = username;
                EventBus.trigger('updateUser');
                EventBus.trigger('signupUser');
            } else {
                EventBus.trigger('errorSignup', `Server response has status ${status}`);
            }
        }).catch(err => {
            EventBus.trigger('errorSignup', err);
        });
    }

    updatePassword(password) {
        let response = Net.updatePassword(this.id, password);
        response.then((status) => {
            EventBus.trigger('getNewPassword');
        });
    }
}

export default class ProfileModel {
    static get instance() {
        return this._instance || (this._instance = new UserModel());
    }
}
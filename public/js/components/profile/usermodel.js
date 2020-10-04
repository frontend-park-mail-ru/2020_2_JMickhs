import Net from '../../helpers/network/network';

export default class UserModel {
    constructor() {
        this.login = '';
        this.id = -1;
        this.isAuth = false;

        this.updateEvent = 'updateUser';
    }
    getCurrUser() {
        let response = Net.getCurrUser();
        response.then((response) => {
            let status = response.status;
            let body = response.body; // TODO:
            if (status === 200) {
                this.isAuth = true;
                this.login = body.username;
                this.id = body.id;
                EventBus.trigger('updateUser');
            }
        });
    }
    signin(username, password) {
        let response = Net.signin(username, password);
        response.then((response) => {
            let status = response.status;
            if (status === 200) {
                this.id = response.body.id;
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
            if (status === 200) {
                this.id = response.body.id;
                this.isAuth = true;
                this.login = username;
            }
            EventBus.trigger('updateUser');
            EventBus.trigger('signupUser');
        }).catch(err => {
            EventBus.trigger('errorSignup');
        });
    }

    updatePassword(password){
        let response = Net.updatePassword(this.id, password);
        response.then((status) => {
            EventBus.trigger('update2Password');
        });
    }
}

import ProfileModel from '../profile/profileModel';

export default class SignupModel {
    constructor() {
        this._user = ProfileModel.instance;
        EventBus.subscribe('signupUser', () => {
            if (this._user.isAuth) {
                document.location.href = '#/profile';
                return;
            } else {
                EventBus.trigger('errorSignup');
            }
        });
    }
    signup(username, password) {
        this._user.signup(username, password);
    }
    isAuth() {
        return this._user.isAuth;
    }
}
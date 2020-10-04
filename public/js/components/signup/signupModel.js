import ProfileModel from '../profile/profileModel';

export default class SignupModel {
    constructor() {
        this._user = ProfileModel.instance;
        EventBus.subscribe('signupUser', () => {
            if (this._user.isAuth) {
                document.location.href = '#/profile';
            } else {
                EventBus.trigger('errorSignup', 'You are not authenticated');
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

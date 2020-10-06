import ProfileModel from '../profile/profileModel';

export default class SignupModel {
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        EventBus.subscribe('signupUser', () => {
            if (this._user.isAuth) {
                router.pushState('/profile');
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

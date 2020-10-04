import ProfileModel from '../profile/profileModel';

export default class SigninModel {
    constructor() {
        this._user = ProfileModel.instance;
        EventBus.subscribe('signinUser', () => {
            if (this._user.isAuth) {
                document.location.href = '#/profile';
            } else {
                EventBus.trigger('errorSignin');
            }
        });
    }
    signin(username, password) {
        this._user.signin(username, password);
    }
    isAuth() {
        return this._user.isAuth;
    }
}
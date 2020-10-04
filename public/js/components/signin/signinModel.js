import UserModel from '../profile/usermodel';

export default class SigninModel {
    constructor(modelUser) {
        if (modelUser instanceof UserModel) {
            this._user = modelUser;
        }
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
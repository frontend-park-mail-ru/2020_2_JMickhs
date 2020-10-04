import UserModel from '../profile/usermodel';

export default class SignupModel {
    constructor(modelUser) {
        if (modelUser instanceof UserModel) {
            this._user = modelUser;
        }
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

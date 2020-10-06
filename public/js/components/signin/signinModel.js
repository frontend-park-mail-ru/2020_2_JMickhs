import ProfileModel from '../profile/profileModel';

export default class SigninModel {
    constructor() {
        this._user = ProfileModel.instance;
        EventBus.subscribe('signinUser', () => {
            if (this._user.isAuth) {
                router.pushState('/profile');
            } else {
                EventBus.trigger('errorSignin', 'Неверный логин или пароль!');
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
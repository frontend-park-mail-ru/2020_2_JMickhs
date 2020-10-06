import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';

export default class SigninModel {
    constructor() {
        this._user = ProfileModel.instance;
        this.timerId = -1;
        Events.subscribe('signinUser', () => {
            if (this._user.isAuth) {
                Events.trigger('redirect', {url: '/profile'});
            } else {
                Events.trigger('errorSignin', 'Неверный логин или пароль!');
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

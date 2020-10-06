import ProfileModel from '../profile/profileModel';
import Events from './../../helpers/eventbus/eventbus';

export default class NavbarModel {
    constructor() {
        this.el1 = {text: 'HostelScan', ref: '/'};
        this.el2 = {text: 'Список отелей', ref: '/list'};
        this.el3 = {text: 'Авторизация', ref: '/signin'};

        this._user = ProfileModel.instance;

        Events.subscribe('updateUser', () => {
            if (this._user.isAuth) {
                this.el3 = {text: this._user.login, ref: '/profile'};
                Events.trigger('updateNavbar');
            }
        });
        Events.subscribe('pageSignup', () => {
            this.el3 = {text: 'Регистрация', ref: '/signup'};
            Events.trigger('updateNavbar');
        });
        Events.subscribe('pageSignin', () => {
            this.el3 = {text: 'Авторизация', ref: '/signin'};
            Events.trigger('updateNavbar');
        });
    }
}

import ProfileModel from '../profile/profileModel';

export default class NavbarModel {
    constructor() {
        this.el1 = { text: 'HostelScan', ref: '/' };
        this.el2 = { text: 'Список отелей', ref: '/list' };
        this.el3 = { text: 'Авторизация', ref: '/signin' };

        this._user = ProfileModel.instance;

        EventBus.subscribe('updateUser', () => {
            if (this._user.isAuth) {
                this.el3 = { text: this._user.login, ref: '/profile' };
                EventBus.trigger('updateNavbar');
            }
        });
        EventBus.subscribe('pageSignup', () => {
            this.el3 = { text: 'Регистрация', ref: '/signup' };
            EventBus.trigger('updateNavbar');
        });
        EventBus.subscribe('pageSignin', () => {
            this.el3 = { text: 'Авторизация', ref: '/signin' };
            EventBus.trigger('updateNavbar');
        });
    }
}
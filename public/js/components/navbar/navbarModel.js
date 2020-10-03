import UserModel from '../profile/usermodel'

export default class NavbarModel {
    constructor(userModel) {
        this.el1 = { text: 'HostelScan', ref: '#/' };
        this.el2 = { text: 'Список отелей', ref: '#/list' };
        this.el3 = { text: 'Авторизация', ref: '#/signin' };

        if (userModel instanceof UserModel) {
            this._user = userModel;
        }

        EventBus.subscribe('updateUser', () => {
            if (this._user.isAuth) {
                this.el3 = { text: this._user.login, ref: '#/profile' };
                EventBus.trigger('updateNavbar');
            }
        })
    }
}
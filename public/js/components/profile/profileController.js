import ProfileModel from './profileModel';
import ProfileView from './profileView';
import {validate} from '../../helpers/validation/validation'

export default class ProfileController {
    constructor(parent) {
        this._model = ProfileModel.instance;
        this._view = new ProfileView(parent, this._model);

        EventBus.subscribe('updatePassword', (arg) => {
            if (arg.oldPassword === '' || arg.newPassword === '') {
                this._view.renderError('Заполните все поля');
                return;
            }
            if (validate({login: arg.login, password: arg.newPassword}, this._view)) {
                this._model.updatePassword(arg.oldPassword, arg.newPassword);
            }
        });

    }
    activate() {
        if (this._model.isAuth) {
            this._view.render();
            return;
        }
        EventBus.subscribe('haventUser', () => {
            document.location.href = '#/signin';
        });
        EventBus.subscribe('profileUser', () => {
            this._view.render();
        });
        EventBus.subscribe('signout', () => {
            document.location.href = '#/signin';
        });
    }
}

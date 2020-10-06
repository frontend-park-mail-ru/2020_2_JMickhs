import ProfileModel from './profileModel';
import ProfileView from './profileView';
import {validate} from '../../helpers/validation/validation';

export default class ProfileController {
    constructor(parent) {
        this._model = ProfileModel.instance;
        this._view = new ProfileView(parent, this._model);

        EventBus.subscribe('updatePassword', (arg) => {
            if (arg.oldPassword === '' || arg.newPassword === '') {
                this._view.renderMessage('Заполните все поля');
                return;
            }
            if (validate({login: '', password: arg.newPassword}, 'profileRenderError')) {
                this._model.updatePassword(arg.oldPassword, arg.newPassword);
            }
        });

        EventBus.subscribe('signout', () => {
            router.pushState('/signin');
        });
    }
    activate() {
        if (this._model.isAuth) {
            this._view.render();
            return;
        }
        EventBus.subscribe('haventUser', () => {
            router.pushState('/signin');
        });
        EventBus.subscribe('profileUser', () => {
            this._view.render();
        });
    }
}

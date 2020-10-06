import ProfileModel from './profileModel';
import ProfileView from './profileView';
import Events from './../../helpers/eventbus/eventbus';
import {validate} from '../../helpers/validation/validation';

export default class ProfileController {
    constructor(parent) {
        this._model = ProfileModel.instance;
        this._view = new ProfileView(parent, this._model);

        Events.subscribe('updatePassword', (arg) => {
            if (arg.oldPassword === '' || arg.newPassword === '') {
                this._view.renderMessage('Заполните все поля');
            } else if (arg.oldPassword === arg.newPassword) {
                this._view.renderMessage('Вы ввели одинаковые пароли');
            } else if (validate({login: '', password: arg.newPassword}, 'profileRenderError')) {
                this._model.updatePassword(arg.oldPassword, arg.newPassword);
            }
        });

        Events.subscribe('signout', () => {
            Events.trigger('redirect', {url: '/signin'});
        });
    }
    activate() {
        if (this._model.isAuth) {
            this._view.render();
            return;
        }
        Events.subscribe('haventUser', () => {
            Events.trigger('redirect', {url: '/signin'});
        });
        Events.subscribe('profileUser', () => {
            this._view.render();
        });
    }
}

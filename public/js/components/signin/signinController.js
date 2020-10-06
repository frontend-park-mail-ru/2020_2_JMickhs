import SigninModel from './signinModel';
import SigninView from './signinView';
import {validate} from '../../helpers/validation/validation';

export default class SigninController {
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent, this._model);

        EventBus.subscribe('submitSignin', (arg) => {
            if (arg.login === '' || arg.password === '') {
                this._view.renderError('Заполните все поля');
                return;
            }
            if (validate(arg, 'authRenderError')) {
                this._model.signin(arg.login, arg.password);
            }
        });
    }
    activate() {
        if (this._model.isAuth()) {
            router.pushState('/profile');
            return;
        }
        this._view.render();
        EventBus.trigger('pageSignin');
    }
}
import SignupModel from './signupModel';
import SignupView from './signupView';
import {validate} from '../../helpers/validation/validation'

export default class SignupController {
    constructor(parent) {
        this._model = new SignupModel();
        this._view = new SignupView(parent, this._model);
        EventBus.subscribe('submitSignup', (arg) => {
            let pass1 = arg.password1;
            let pass2 = arg.password2;
            let login = arg.login;
            if (login === '' || pass1 === '' || pass2 === '') {
                this._view.renderError('Заполните все поля');
            } else if (pass1 !== pass2) {
                this._view.renderError('Пароли не совпадают');
            } else if (validate({login: login, password: pass1}, this._view)) {
                this._model.signup(login, pass1);
            }
        });
    }
    activate() {
        if (this._model.isAuth()) {
            document.location.href = '#/profile';
            return;
        }
        this._view.render();
        EventBus.trigger('pageSignup');
    }
}
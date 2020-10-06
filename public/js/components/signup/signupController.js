import SignupModel from './signupModel';
import SignupView from './signupView';
import Events from './../../helpers/eventbus/eventbus';
import {validate} from '../../helpers/validation/validation';

export default class SignupController {
    constructor(parent) {
        this._model = new SignupModel();
        this._view = new SignupView(parent, this._model);
        Events.subscribe('submitSignup', (arg) => {
            const pass1 = arg.password1;
            const pass2 = arg.password2;
            const login = arg.login;
            if (login === '' || pass1 === '' || pass2 === '') {
                this._view.renderError('Заполните все поля');
            } else if (pass1 !== pass2) {
                this._view.renderError('Пароли не совпадают');
            } else if (validate({login: login, password: pass1}, 'logRenderError')) {
                this._model.signup(login, pass1);
            }     
        });
    }
    activate() {
        if (this._model.isAuth()) {
            Events.trigger('redirect', {url: '/profile'});
            return;
        }
        this._view.render();
        Events.trigger('pageSignup');
    }
}

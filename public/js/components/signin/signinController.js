import SigninModel from './signinModel';
import SigninView from './signinView';

export default class SigninController {
    constructor(parent, userModel) {

        this._model = new SigninModel(userModel);
        this._view = new SigninView(parent, this._model);

        EventBus.subscribe('submitSignin', (arg) => {
            let { login, password } = arg;
            let canSend = true;
            if (login === '') {
                this._view.renderErrLogin(true, 'Введите логин!');
                canSend = false;
            } else {
                this._view.renderErrLogin(false);
            }
            if (password === '') {
                this._view.renderErrPassword(true, 'Введите пароль!');
                canSend = false;
            } else {
                this._view.renderErrPassword(false);
            }

            if (canSend) {
                this._model.signin(arg.login, arg.password);
            }
        });
    }
    activate() {
        if (this._model.isAuth()) {
            document.location.href = '#/profile';
            return;
        }
        this._view.render();
    }
}
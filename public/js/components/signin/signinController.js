import SigninModel from './signinModel';
import SigninView from './signinView';

export default class SigninController {
    constructor(parent) {
        this._model = new SigninModel();
        this._view = new SigninView(parent, this._model);

        EventBus.subscribe('submitSignin', (arg) => {
            let canSend = this.validate(arg);
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

    validate(arg) {
        let { login, password } = arg;
        let canSend = true;
        if (login === '') {
            this._view.renderErrLogin(true, 'Введите логин!');
            canSend = false;
        } else if (login.length > 20) {
            this._view.renderErrLogin(true, 'Логин не может быть больше 20 символов');
            canSend = false;
        } else {
            this._view.renderErrLogin(false);
        }
        if (password === '') {
            this._view.renderErrPassword(true, 'Введите пароль!');
            canSend = false;
        } else if (password.length < 8) {
            this._view.renderErrPassword(true, 'Пароль не может быть меньше 8 символов');
            canSend = false;
        } else if (password.length > 20) {
            this._view.renderErrPassword(true, 'Пароль не может быть больше 20 символов');
            canSend = false;
        } else {
            this._view.renderErrPassword(false);
        }
        return canSend;
    }
}
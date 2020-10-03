import SignupModel from './signupModel'
import SignupView from './signupView'

export default class SignupController {
    constructor(parent, userModel) {
        this._model = new SignupModel(userModel);
        this._view = new SignupView(parent, this._model);
        EventBus.subscribe('submitSignup', (arg) => {
            let pass1 = arg.password1;
            let pass2 = arg.password2;
            let login = arg.login;
            if (pass1 != pass2) {
                console.log('пароли не равны', pass1, pass2)
                alert('пароли не равны');
                return;
            }
            this._model.signup(login, pass1)
        });
    }
    activate() {
        if (this._model.isAuth()) {
            document.location.href = "#/profile";
            return;
        }
        this._view.render();
    }
}
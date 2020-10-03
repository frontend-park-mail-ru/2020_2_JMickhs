import UserModel from './usermodel'
import ProfileView from './profileView'

export default class ProfileController {
    constructor(parent, userModel) {
        if (userModel instanceof UserModel) {
            this._model = userModel;
        }
        this._view = new ProfileView(parent, this._model);

        EventBus.subscribe('updatePassword', (arg) => {
            this._model.updatePassword(arg.password);
        })
    }
    activate() {
        if (this._model.isAuth) {
            this._view.render();
            return;
        }
        document.location.href = "#/signin"
    }
}

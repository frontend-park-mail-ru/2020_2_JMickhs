import UserModel from '../profile/usermodel';
import NavbarModel from './navbarModel'
import NavbarView from './navbarView'

export default class NavbarController {
    constructor(parent, userModel) {
        this._model = new NavbarModel(userModel);
        if (parent instanceof HTMLElement) {
            this._view = new NavbarView(parent, this._model);
        }
    }
    activate() {
        this._view.render();
    }
}
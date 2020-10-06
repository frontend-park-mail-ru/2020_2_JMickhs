import NavbarModel from './navbarModel';
import NavbarView from './navbarView';

export default class NavbarController {
    constructor(parent) {
        this._model = new NavbarModel();
        if (parent instanceof HTMLElement) {
            this._view = new NavbarView(parent, this._model);
        }
    }
    activate() {
        this._view.render();
    }
}

import HomeView from './homeView';

export default class HomeController {
    constructor(parent) {
        this._view = new HomeView(parent);
    }
    activate() {
        this._view.render();
    }
}

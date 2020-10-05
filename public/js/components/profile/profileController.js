import ProfileModel from './profileModel';
import ProfileView from './profileView';

export default class ProfileController {
    constructor(parent) {
        this._model = ProfileModel.instance;
        this._view = new ProfileView(parent, this._model);

        EventBus.subscribe('updatePassword', (arg) => {
            this._model.updatePassword(arg.password);
        });
    }
    activate() {
        if (this._model.isAuth) {
            this._view.render();
            return;
        }
        EventBus.subscribe('haventUser', () => {
            document.location.href = '#/signin';
        });
        EventBus.subscribe('profileUser', () => {
            this._view.render();
        });
        EventBus.subscribe('signout', () => {
            router.pushState('/signin');
        });
    }
}

import ProfileModel from '@/components/profile/profile-model';
import ProfileView from '@/components/profile/profile-view';
import Events from '@evenbus/eventbus';
import {
    PAGE_PROFILE,
} from '@evenbus/constants';

import Redirector from '@router/redirector';

export default class ProfileController {
    private view: ProfileView;

    private model: ProfileModel;

    constructor(parent: HTMLElement) {
        this.model = new ProfileModel();
        this.view = new ProfileView(parent);
    }

    activate(): void {
        Events.trigger(PAGE_PROFILE, this.model.getData());
        if (this.model.isAuth()) {
            this.view.render(this.model.getData());
        } else {
            Redirector.redirectTo('/signin');
        }
    }

    deactivate(): void {
        this.view.hide();
    }
}

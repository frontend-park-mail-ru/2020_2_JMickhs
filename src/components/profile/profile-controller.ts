import ProfileModel from '@/components/profile/profile-model';
import ProfileView from '@/components/profile/profile-view';
import Events from '@eventbus/eventbus';
import {
    PAGE_PROFILE,
    AUTH_USER,
    NOT_AUTH_USER,
} from '@eventbus/constants';

import Redirector from '@router/redirector';
import type { UserData } from '@interfaces/structs-data/user-data';

export default class ProfileController {
    private view: ProfileView;

    private model: ProfileModel;

    constructor(place: HTMLElement) {
        this.model = new ProfileModel();
        this.view = new ProfileView(place);
    }

    private render = (data: UserData): void => {
        this.view.render(data);
    };

    private redirectSignin = (): void => {
        Redirector.redirectTo('/signin');
    };

    activate(): void {
        Events.trigger(PAGE_PROFILE, this.model.getData());
        if (this.model.isWaiting()) {
            this.subscribeEvents();
            return;
        }
        if (this.model.isAuth()) {
            this.view.render(this.model.getData());
        } else {
            this.redirectSignin();
        }
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.render);
        Events.subscribe(NOT_AUTH_USER, this.redirectSignin);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(AUTH_USER, this.render);
        Events.unsubscribe(NOT_AUTH_USER, this.redirectSignin);
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }
}

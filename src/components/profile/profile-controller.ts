import ProfileModel from '@/components/profile/profile-model';
import ProfileView from '@/components/profile/profile-view';
import Events from '@evenbus/eventbus';
import {
    PAGE_PROFILE,
    AUTH_USER,
    NOT_AUTH_USER,
} from '@evenbus/constants';

import Redirector from '@router/redirector';
import type { HandlerEvent } from '@/helpers/interfaces/functions';

export default class ProfileController {
    private view: ProfileView;

    private model: ProfileModel;

    private handlers: Record<string, HandlerEvent>;

    constructor(parent: HTMLElement) {
        this.model = new ProfileModel();
        this.view = new ProfileView(parent);

        this.handlers = this.makeHandlers();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            render: this.view.render.bind(this.view),
            redirect: (): void => {
                Redirector.redirectTo('/signin');
            },
        };
    }

    activate(): void {
        Events.trigger(PAGE_PROFILE, this.model.getData());
        if (this.model.isWaiting()) {
            this.subscribeEvents();
            return;
        }
        if (this.model.isAuth()) {
            this.view.render(this.model.getData());
        } else {
            this.handlers.redirect('/signin');
        }
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.handlers.render);
        Events.subscribe(NOT_AUTH_USER, this.handlers.redirect);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(AUTH_USER, this.handlers.render);
        Events.unsubscribe(NOT_AUTH_USER, this.handlers.redirect);
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }
}

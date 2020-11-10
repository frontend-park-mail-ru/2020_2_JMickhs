import NavModel from '@/components/navbar/navbar-model';
import NavView from '@/components/navbar/navbar-view';
import Events from '@evenbus/eventbus';
import {
    PAGE_SIGNIN,
    PAGE_SIGNUP,
    PAGE_PROFILE,
    CHANGE_USER_OK,
    AUTH_USER,
    SIGNIN_USER,
    SIGNUP_USER,
} from '@evenbus/constants';

import type { UserData } from '@/helpers/interfaces/structs-data/user-data';

export default class NavController {
    private model: NavModel;

    private view: NavView;

    constructor(parent: HTMLElement) {
        this.model = new NavModel();
        this.view = new NavView(parent);
    }

    activate(): void {
        this.view.render(this.model.getData());
        Events.subscribe(PAGE_SIGNUP, this.pageSign.bind(this));
        Events.subscribe(PAGE_SIGNIN, this.pageSign.bind(this));
        Events.subscribe(PAGE_PROFILE, this.updateUsr.bind(this));
        Events.subscribe(SIGNIN_USER, this.updateUsr.bind(this));
        Events.subscribe(SIGNUP_USER, this.updateUsr.bind(this));
        Events.subscribe(AUTH_USER, this.updateUsr.bind(this));
        Events.subscribe(CHANGE_USER_OK, this.updateUsr.bind(this));
    }

    private pageSign(): void {
        this.model.setData('');
        this.view.render(this.model.getData());
    }

    private updateUsr(user: UserData): void {
        this.model.setData(user.username);
        this.view.render(this.model.getData());
    }
}

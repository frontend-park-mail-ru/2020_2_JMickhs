import NavModel from '@navbar/navModel';
import NavView from '@navbar/navView';
import Events from '@eventBus/eventbus';
import {
    PAGE_SIGNIN,
    PAGE_SIGNUP,
    CHANGE_USER_OK,
    HAVE_USER,
    SIGNIN_USER,
    SIGNUP_USER,
} from '@eventBus/constants';

import {UserData} from '@interfaces/userData';

export default class NavController {

    private model: NavModel;
    private view: NavView;

    constructor(parent: HTMLElement) {
        this.model = new NavModel();
        this.view = new NavView(parent);
    }

    activate(): void {
        this.view.render(this.model.getData());
        Events.subscribe(PAGE_SIGNUP, this.pageSignup.bind(this));
        Events.subscribe(PAGE_SIGNIN, this.pageSignin.bind(this));
        Events.subscribe(SIGNIN_USER, this.updateUsr.bind(this));
        Events.subscribe(SIGNUP_USER, this.updateUsr.bind(this));
        Events.subscribe(HAVE_USER, this.updateUsr.bind(this));
        Events.subscribe(CHANGE_USER_OK, this.updateUsr.bind(this));
    }

    private pageSignup(): void {
        this.model.setData('');
        this.view.render(this.model.getData());
    }

    private pageSignin(): void {
        this.model.setData('');
        this.view.render(this.model.getData());
    }

    private updateUsr(user: UserData): void {
        this.model.setData(user.username);
        this.view.render(this.model.getData());
    }
}

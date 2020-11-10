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
    NOT_AUTH_USER,
} from '@evenbus/constants';

export default class NavController {
    private model: NavModel;

    private view: NavView;

    constructor(parent: HTMLElement) {
        this.model = new NavModel();
        this.view = new NavView(parent);
    }

    activate(): void {
        this.view.render(this.model.getData());
        Events.subscribe(PAGE_SIGNUP, this.update.bind(this));
        Events.subscribe(PAGE_SIGNIN, this.update.bind(this));
        Events.subscribe(PAGE_PROFILE, this.update.bind(this));
        Events.subscribe(SIGNIN_USER, this.update.bind(this));
        Events.subscribe(SIGNUP_USER, this.update.bind(this));
        Events.subscribe(AUTH_USER, this.update.bind(this));
        Events.subscribe(NOT_AUTH_USER, this.update.bind(this));
        Events.subscribe(CHANGE_USER_OK, this.update.bind(this));
    }

    private update(): void {
        this.view.render(this.model.getData());
    }
}

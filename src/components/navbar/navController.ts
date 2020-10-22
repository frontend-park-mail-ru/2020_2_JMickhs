import NavModel from '@navbar/navModel';
import NavView from '@navbar/navView';
import Events from '@eventBus/eventbus';
import {
    NAVBAR_ACTIVE,
    PAGE_SIGNIN,
    PAGE_SIGNUP,
    CHANGE_USER_OK,
    PROFILE_USER,
    SIGNIN_USER,
    SIGNUP_USER,
} from '@eventBus/constants';

interface User {
    username: string,
    id: number,
    avatar: string,
    isAuth: boolean,
}

export default class NavController {

    private model: NavModel;
    private view: NavView;

    constructor(parent: HTMLElement) {
        this.model = new NavModel();
        this.view = new NavView(parent);
    }

    activate(): void {
        this.view.render(this.model.getData());
        Events.subscribe(NAVBAR_ACTIVE, this.navbarActive.bind(this));
        Events.subscribe(PAGE_SIGNUP, this.pageSignup.bind(this));
        Events.subscribe(PAGE_SIGNIN, this.pageSignin.bind(this));
        Events.subscribe(SIGNIN_USER, this.updateUsr.bind(this));
        Events.subscribe(SIGNUP_USER, this.updateUsr.bind(this));
        Events.subscribe(PROFILE_USER, this.updateUsr.bind(this));
        Events.subscribe(CHANGE_USER_OK, this.updateUsr.bind(this));
    }

    private navbarActive(n: number) {
        this.model.updateActive(n - 1);
        this.view.render(this.model.getData());
    }

    private pageSignup() {
        const changeElem = 3;
        this.model.updateElem(changeElem - 1, { text: 'Регистрация', href: '/signup', active: true });
        this.navbarActive(changeElem);
    }

    private pageSignin() {
        const changeElem = 3;
        this.model.updateElem(changeElem - 1, { text: 'Авторизация', href: '/signin', active: true });
        this.navbarActive(changeElem);
    }

    private updateUsr(user: User) {
        const changeElem = 3;
        this.model.updateElem(changeElem - 1, { text: user.username, href: '/profile', active: true });
        this.navbarActive(changeElem);
    }
}

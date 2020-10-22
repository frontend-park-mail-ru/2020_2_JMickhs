import NavModel from './navModel';
import NavView from './navView';
import Events from '../../helpers/eventbus/eventbus';
import {
    NAVBAR_ACTIVE,
    PAGE_SIGNIN,
    PAGE_SIGNUP,
    FIX_USER,
    PROFILE_USER,
    SIGNIN_USER,
    SIGNUP_USER,
} from '../../helpers/eventbus/constants';

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
        Events.subscribe(FIX_USER, this.updateUsr.bind(this));
    }
    private navbarActive(n: number) {
        this.model.updateActive(n - 1);
        this.view.render(this.model.getData());
    }
    private pageSignup() {
        this.model.updateElem(2, {text: 'Регистрация', href: '/signup', active: true});
    }
    private pageSignin() {
        this.model.updateElem(2, {text: 'Авторизация', href: '/signin', active: true});
    }
    private updateUsr(user: User) {
        this.model.updateElem(2, {text: user.username, href: '/profile', active: true});
    }
}
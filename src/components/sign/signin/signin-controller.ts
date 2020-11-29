import type { PageController } from '@interfaces/controllers';
import SigninModel from '@sign/signin/signin-model';
import SigninView from '@sign/signin/signin-view';
import Events from '@eventbus/eventbus';
import {
    PAGE_SIGNIN,
    SUBMIT_SIGNIN,
    AUTH_USER,
} from '@eventbus/constants';
import {
    INPUT_LOGIN,
    INPUTS_PASWORDS,
} from '@sign/constants/input-names';
import Redirector from '@router/redirector';

export default class SigninController implements PageController {
    private view: SigninView;

    private model: SigninModel;

    constructor(place: HTMLElement) {
        this.view = new SigninView(place);
        this.model = new SigninModel();
    }

    activate(): void {
        this.subscribeEvents();
        Events.trigger(PAGE_SIGNIN);
        if (this.model.isAuth()) {
            this.redirectToProfile();
            return;
        }
        this.view.render();
    }

    deactivate(): void {
        this.view.hide();
        this.unsubscribeEvents();
    }

    private subscribeEvents(): void {
        Events.subscribe(SUBMIT_SIGNIN, this.validate);
        Events.subscribe(AUTH_USER, this.redirectToProfile);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SUBMIT_SIGNIN, this.validate);
        Events.unsubscribe(AUTH_USER, this.redirectToProfile);
    }

    private redirectToProfile(): void {
        Redirector.redirectTo('/profile');
    }

    private validate = (arg: {login: string, password: string}): void => {
        const { login, password } = arg;
        let resolution = true;
        if (login === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', INPUT_LOGIN);
        }
        if (password === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', INPUTS_PASWORDS);
        }

        if (resolution) {
            this.model.signin(login, password);
        }
    };
}

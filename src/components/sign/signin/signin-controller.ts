import { PageController } from '@interfaces/controllers';
import SigninModel from '@/components/sign/signin/signin-model';
import SigninView from '@/components/sign/signin/signin-view';
import Events from '@evenbus/eventbus';
import {
    PAGE_SIGNIN,
    SUBMIT_SIGNIN,
    AUTH_USER,
} from '@evenbus/constants';
import Redirector from '@router/redirector';
import { HandlerEvent } from '@interfaces/functions';

export default class SigninController implements PageController {
    private view: SigninView;

    private model: SigninModel;

    private handlers: Record<string, HandlerEvent>;

    constructor(parent: HTMLElement) {
        this.view = new SigninView(parent);
        this.model = new SigninModel();

        this.handlers = this.makeHandlers();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            validate: this.validate.bind(this),
        };
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
        Events.subscribe(SUBMIT_SIGNIN, this.handlers.validate);
        Events.subscribe(AUTH_USER, this.redirectToProfile);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(SUBMIT_SIGNIN, this.handlers.validate);
        Events.unsubscribe(AUTH_USER, this.redirectToProfile);
    }

    private redirectToProfile(): void {
        Redirector.redirectTo('/profile');
    }

    private validate(arg: {login: string, password: string}): void {
        const { login, password } = arg;
        let resolution = true;
        if (login === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', 1);
        }
        if (password === '') {
            resolution = false;
            this.view.renderError('Заполните все поля!', 2);
        }

        if (resolution) {
            this.model.signin(login, password);
        }
    }
}

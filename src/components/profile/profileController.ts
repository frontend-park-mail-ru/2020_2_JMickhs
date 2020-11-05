import ProfileModel from '@profile/profileModel';
import ProfileView from '@profile/profileView';
import Events from '@eventBus/eventbus';
import {
    UPDATE_PASSWORD,
    PAGE_PROFILE,
} from '@eventBus/constants';
import Validator from '@/helpers/validator/validator';
import Redirector from '@router/redirector';
import { HandlerEvent } from '@interfaces/functions';

export default class ProfileController {
    private handlers: Record<string, HandlerEvent>;

    private view: ProfileView;

    private model: ProfileModel;

    constructor(parent: HTMLElement) {
        this.model = new ProfileModel();
        this.view = new ProfileView(parent);

        this.handlers = this.makeHandlers();
    }

    activate(): void {
        Events.trigger(PAGE_PROFILE, this.model.getData());
        this.subscribeEvents();
        if (this.model.isAuth()) {
            this.view.render(this.model.getData());
        } else {
            Redirector.redirectTo('/signin');
        }
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.view.hide();
    }

    subscribeEvents(): void {
        Events.subscribe(UPDATE_PASSWORD, this.handlers.updatePsw);
    }

    unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_PASSWORD, this.handlers.updatePsw);
    }

    private validatePswChange(arg: {oldPassword: string, newPassword1: string, newPassword2: string}) {
        const oldPsw = arg.oldPassword;
        const newPsw1 = arg.newPassword1;
        const newPsw2 = arg.newPassword2;
        if (oldPsw === '') {
            this.view.renderOldPswInputError();
            this.view.renderMsgPswSettings('Необходимо заполнить все поля');
            return;
        }
        if (newPsw1 === '') {
            this.view.renderNewPswInputError();
            this.view.renderMsgPswSettings('Необходимо заполнить все поля');
            return;
        }
        if (newPsw1 !== newPsw2) {
            this.view.renderNewPswInputError();
            this.view.renderMsgPswSettings('Пароли не совпадают');
            return;
        }
        if (oldPsw === newPsw1) {
            this.view.renderNewPswInputError();
            this.view.renderOldPswInputError();
            this.view.renderMsgPswSettings('Старый и новый пароль совпадает');
            return;
        }

        const pswErrors = Validator.validatePassword(newPsw1);
        if (pswErrors.length > 0) {
            this.view.renderNewPswInputError();
            this.view.renderMsgPswSettings(pswErrors[0]);
            return;
        }

        this.model.updatePassword(oldPsw, newPsw2);
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        const handlers = {
            updatePsw: this.validatePswChange.bind(this),
        };
        return handlers;
    }
}

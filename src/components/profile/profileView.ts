import { PageView } from '@interfaces/views';
import Events from '@eventBus/eventbus';
import {
    AUTH_USER,
    CHANGE_USER_OK,
} from '@eventBus/constants';

import * as profileTemplate from '@profile/templates/profilePage.hbs';
import DataUserComponent from '@profile/components/profileData';
import SettingsDataComponent from '@profile/components/settingsData';
import SettingsPasswordComponent from '@profile/components/settingsPassword';
import { HandlerEvent } from '@interfaces/functions';
import { UserData } from '@/helpers/interfaces/structsData/userData';

export default class ProfileView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private dataComponent?: DataUserComponent;

    private settingsDataComponent?: SettingsDataComponent;

    private settingsPasswordComponent?: SettingsPasswordComponent;

    constructor(parent: HTMLElement) {
        super(parent);

        this.handlers = this.makeHandlers();
    }

    private subscribeEvents(): void {
        Events.subscribe(AUTH_USER, this.handlers.render);
        Events.subscribe(CHANGE_USER_OK, this.handlers.okChangeUser);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(AUTH_USER, this.handlers.render);
        Events.unsubscribe(CHANGE_USER_OK, this.handlers.okChangeUser);
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            render: this.render.bind(this),
            okChangeUser: (user: UserData) => {
                this.dataComponent.updateData(user.username, user.email);
            },
        };
    }

    render(data: UserData): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = profileTemplate(data);

        const dataPlace = document.getElementById('profile-data') as HTMLDivElement;
        this.dataComponent = new DataUserComponent(dataPlace);
        const settingsDataPlace = document.getElementById('settings-data') as HTMLDivElement;
        this.settingsDataComponent = new SettingsDataComponent(settingsDataPlace);
        const settingsPasswordPlace = document.getElementById('settings-password') as HTMLDivElement;
        this.settingsPasswordComponent = new SettingsPasswordComponent(settingsPasswordPlace);

        this.dataComponent.activate(data);
        this.settingsDataComponent.activate();
        this.settingsPasswordComponent.activate();

        this.subscribeEvents();
    }

    hide(): void {
        if (this.page.innerHTML === '') {
            return;
        }
        this.unsubscribeEvents();

        this.dataComponent.deactivate();
        this.settingsDataComponent.deactivate();
        this.settingsPasswordComponent.deactivate();

        this.page.innerHTML = '';
    }
}

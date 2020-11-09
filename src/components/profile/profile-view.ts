import { PageView } from '@interfaces/views';
import Events from '@evenbus/eventbus';
import {
    AUTH_USER,
    CHANGE_USER_OK,
} from '@evenbus/constants';
import DataUserComponent from '@/components/profile/profile-data/profile-data';
import SettingsDataComponent from '@/components/profile/settings-data/settings-data';
import SettingsPasswordComponent from '@/components/profile/settings-password/settings-password';
import { HandlerEvent } from '@interfaces/functions';
import { UserData } from '@/helpers/interfaces/structsData/user-data';

import * as profileTemplate from '@profile/templates/profile.hbs';
import '@profile/templates/profile.css';

export default class ProfileView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private dataComponent?: DataUserComponent;

    private settingsDataComponent?: SettingsDataComponent;

    private settingsPasswordComponent?: SettingsPasswordComponent;

    constructor(parent: HTMLElement) {
        super(parent);

        this.dataComponent = new DataUserComponent();
        this.settingsDataComponent = new SettingsDataComponent();
        this.settingsPasswordComponent = new SettingsPasswordComponent();

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
            okChangeUser: (user: UserData): void => {
                this.dataComponent.updateData(user.username, user.email);
            },
        };
    }

    render(data: UserData): void {
        window.scrollTo(0, 0);
        this.page.innerHTML = profileTemplate(data);

        const dataPlace = document.getElementById('profile-data') as HTMLDivElement;
        this.dataComponent.setPlace(dataPlace);
        const settingsDataPlace = document.getElementById('settings-data') as HTMLDivElement;
        this.settingsDataComponent.setPlace(settingsDataPlace);
        const settingsPasswordPlace = document.getElementById('settings-password') as HTMLDivElement;
        this.settingsPasswordComponent.setPlace(settingsPasswordPlace);

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
import { PageView } from '@interfaces/views';
import Events from '@eventbus/eventbus';
import {
    CHANGE_USER_OK,
} from '@eventbus/constants';
import DataUserComponent from '@/components/profile/profile-data/profile-data';
import SettingsDataComponent from '@/components/profile/settings-data/settings-data';
import SettingsPasswordComponent from '@/components/profile/settings-password/settings-password';
import type { HandlerEvent } from '@interfaces/functions';
import type { UserData } from '@/helpers/interfaces/structs-data/user-data';

import * as profileTemplate from '@profile/templates/profile.hbs';
import '@profile/templates/profile.css';

export default class ProfileView extends PageView {
    private handlers: Record<string, HandlerEvent>;

    private dataComponent: DataUserComponent;

    private settingsDataComponent: SettingsDataComponent;

    private settingsPasswordComponent: SettingsPasswordComponent;

    constructor(parent: HTMLElement) {
        super(parent);

        this.dataComponent = new DataUserComponent();
        this.settingsDataComponent = new SettingsDataComponent();
        this.settingsPasswordComponent = new SettingsPasswordComponent();

        this.handlers = this.makeHandlers();
    }

    private subscribeEvents(): void {
        Events.subscribe(CHANGE_USER_OK, this.handlers.okChangeUser);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(CHANGE_USER_OK, this.handlers.okChangeUser);
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
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

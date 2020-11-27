import MessagePopup from '@popup/message-popup/message-popup';
import Popup from '@popup/popup';

class NotificationUser {
    private messagePopupComponent: MessagePopup;

    private idTimer: number;

    constructor() {
        this.messagePopupComponent = new MessagePopup();
        this.idTimer = -1;
    }

    showMessage(text: string, isError: boolean, time: number|null = 5000): void {
        if (this.idTimer !== -1) {
            this.hideMessage();
            window.clearTimeout(this.idTimer);
        }
        Popup.activate(this.messagePopupComponent, text, isError);

        if (!time) {
            return;
        }

        this.idTimer = window.setTimeout(() => {
            this.hideMessage();
            this.idTimer = -1;
        }, time);
    }

    hideMessage(): void {
        Popup.deactivate();
    }
}

export default new NotificationUser();

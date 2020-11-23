import type { AbstractComponent } from '@interfaces/components';

import * as template from './message-popup.hbs';
import './message-popup.css';

export default class MessagePopup implements AbstractComponent {
    private place: HTMLDivElement;

    activate(message: string, isError: boolean): void {
        if (this.place === undefined) {
            return;
        }

        this.place.innerHTML = template({ text: message, error: isError });
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    deactivate(): void {
        if (this.place === undefined) {
            return;
        }

        this.place.innerHTML = '';
    }
}

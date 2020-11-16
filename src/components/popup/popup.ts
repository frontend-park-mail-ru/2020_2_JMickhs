import type { HandlerEvent } from '@interfaces/functions';
import type { AbstractComponent } from '@interfaces/components';
import * as template from './popup.hbs';
import './popup.css';

class Popup {
    private popup: HTMLDivElement;

    private popupComponent: HTMLDivElement;

    private place: HTMLDivElement;

    private component: AbstractComponent;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.handlers = {
            clickContent: (evt: Event): void => {
                evt.stopPropagation();
            },
            close: (): void => {
                this.component?.deactivate();
                this.unsubscribeEvents();
                this.place.innerHTML = '';
            },
        };
    }

    init(parent: HTMLElement): void {
        let place = document.getElementById('popup-container') as HTMLDivElement;
        if (place == null) {
            place = document.createElement('div');
            place.id = 'popup-container';
            parent.appendChild(place);
        }
        this.place = place;
    }

    activate(component: AbstractComponent, ...args: unknown[]): void {
        if (!this.place) {
            return;
        }

        this.component = component;

        this.place.innerHTML = template();
        this.popup = document.getElementById('popup-container') as HTMLDivElement;
        this.popupComponent = document.getElementById('popup-component') as HTMLDivElement;

        this.component.setPlace(this.popupComponent);
        this.component.activate(...args);

        this.subscribeEvents();
        this.popup.classList.remove('popup__container--hiden');
    }

    private subscribeEvents(): void {
        this.popup.addEventListener('click', this.handlers.close);
        this.popupComponent.addEventListener('click', this.handlers.clickContent);
    }

    private unsubscribeEvents(): void {
        this.popup.removeEventListener('click', this.handlers.close);
        this.popupComponent.removeEventListener('click', this.handlers.clickContent);
    }
}

export default new Popup();

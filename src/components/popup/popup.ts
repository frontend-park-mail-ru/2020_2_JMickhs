import type { AbstractComponent } from '@interfaces/components';
import * as template from './popup.hbs';
import './popup.css';

class Popup {
    private parent: HTMLElement;

    private place: HTMLDivElement;

    private popupComponent: HTMLDivElement;

    private component: AbstractComponent;

    init(parent: HTMLElement): void {
        this.parent = parent;
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
        this.place = document.getElementById('popup-container') as HTMLDivElement;
        this.popupComponent = document.getElementById('popup-component') as HTMLDivElement;

        this.component.setPlace(this.popupComponent);
        this.component.activate(...args);

        this.subscribeEvents();
        this.place.classList.remove('popup__container--hiden');
    }

    private clickContent = (evt: Event): void => {
        evt.stopPropagation();
    };

    private close = (): void => {
        this.component?.deactivate();
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    };

    private subscribeEvents(): void {
        this.place.addEventListener('click', this.close);
        this.popupComponent.addEventListener('click', this.clickContent);
    }

    private unsubscribeEvents(): void {
        this.place.removeEventListener('click', this.close);
        this.popupComponent.removeEventListener('click', this.clickContent);
    }
}

export default new Popup();

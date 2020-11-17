import type { AbstractComponent } from '@interfaces/components';
import * as template from './popup.hbs';
import './popup.css';

class Popup {
    private place: HTMLElement;

    private popup: HTMLDivElement;

    private component: AbstractComponent;

    init(place: HTMLElement): void {
        this.place = place;
    }

    activate(component: AbstractComponent, ...args: unknown[]): void {
        if (!this.place) {
            return;
        }

        this.component = component;

        this.place.innerHTML = template();
        this.popup = document.getElementById('popup-component') as HTMLDivElement;

        this.component.setPlace(this.popup);
        this.component.activate(...args);

        this.subscribeEvents();
        this.place.classList.remove('popup__container--hidden');
    }

    private clickContent = (evt: Event): void => {
        evt.stopPropagation();
    };

    private close = (): void => {
        this.component?.deactivate();
        this.unsubscribeEvents();
        this.place.innerHTML = '';
        this.place.classList.add('popup__container--hidden');
    };

    private subscribeEvents(): void {
        this.place.addEventListener('click', this.close);
        this.popup.addEventListener('click', this.clickContent);
    }

    private unsubscribeEvents(): void {
        this.place.removeEventListener('click', this.close);
        this.popup.removeEventListener('click', this.clickContent);
    }
}

export default new Popup();

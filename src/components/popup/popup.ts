import type { HandlerEvent } from '@interfaces/functions';
import type { AbstractComponent } from '@interfaces/components';
import * as template from './popup.hbs';
import './popup.css';

class Popup {
    private parent: HTMLElement;

    private place: HTMLDivElement;

    private popupComponent: HTMLDivElement;

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
                this.place.classList.add('popup__container--hidden');
            },
        };
    }

    init(parent: HTMLElement): void {
        this.parent = parent;
        this.parent.innerHTML += template({ content: false });
        this.place = document.getElementById('popup-container') as HTMLDivElement;
    }

    activate(component: AbstractComponent, ...args: unknown[]): void {
        if (!this.place) {
            return;
        }

        this.component = component;

        this.place.innerHTML = template({ content: true });
        this.popupComponent = document.getElementById('popup-component') as HTMLDivElement;

        this.component.setPlace(this.popupComponent);
        this.component.activate(...args);

        this.subscribeEvents();
        this.place.classList.remove('popup__container--hidden');
    }

    private subscribeEvents(): void {
        this.place.addEventListener('click', this.handlers.close);
        this.popupComponent.addEventListener('click', this.handlers.clickContent);
    }

    private unsubscribeEvents(): void {
        this.place.removeEventListener('click', this.handlers.close);
        this.popupComponent.removeEventListener('click', this.handlers.clickContent);
    }
}

export default new Popup();

// Коля (К) спрашивает у Ментора (М): «Наташ, а что такое ньюанс?»
// М: — Открывай пр, покажу.
// Коля немного недоумевет, но открывает пр.
// Ментор подходит сзади и засовывает ему понятно что, понятно куда, и объясняет:
// — Вот смотри Колька. Вроде и у тебя пр вашем в проекте и у меня пр в вашем проекте...  Но!
// Есть один нюанс…

import Events from '@eventbus/eventbus';
import { DEACTIVATE_POPUP } from '@eventbus/constants';
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
        this.place.innerHTML = template();
        this.popup = document.getElementById('popup-component') as HTMLDivElement;

        this.component = component;
        this.component.setPlace(this.popup);
        this.component.activate(...args);

        this.subscribeEvents();
        this.place.classList.remove('popup__container--hidden');
    }

    deactivate(): void {
        this.close();
    }

    private blockClose = false;

    private clickContent = (): void => {
        this.blockClose = true;
    };

    private clickKeyboard = (event: KeyboardEvent): void => {
        if (event.code === 'Escape') {
            this.close();
        }
    };

    private close = (): void => {
        if (this.blockClose) {
            this.blockClose = false;
            return;
        }
        this.component?.deactivate();
        this.unsubscribeEvents();
        this.place.innerHTML = '';
        this.place.classList.add('popup__container--hidden');
    };

    private subscribeEvents(): void {
        Events.subscribe(DEACTIVATE_POPUP, this.close);
        this.place.addEventListener('click', this.close);
        this.popup.addEventListener('click', this.clickContent);
        document.addEventListener('keydown', this.clickKeyboard);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(DEACTIVATE_POPUP, this.close);
        this.place.removeEventListener('click', this.close);
        this.popup.removeEventListener('click', this.clickContent);
        document.removeEventListener('keydown', this.clickKeyboard);
    }
}

export default new Popup();

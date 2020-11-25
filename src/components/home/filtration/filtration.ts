// Приезжает комиссия в детский дом для умственно отсталых.
// - Ну, покажите, как вы с детьми работаете, что дети знают.
// Подзывают мальчика и спрашивают:
// - Мальчик, как тебя зоаут?
// - алефаа
// - А кем ты хочешь стать?
// - ненаю
// - А сколько тебе лет?
// - ненаю
// - Ну это не дело, конечно. Нужно работать с ребенком. Через неделю приедим, проверим.
//
// Через неделю снова приезжают:
// - Ну, где наш мальчик?
// - Вот он
//
// - Мальчик, как тебя зовут?
// - Леха!
// - А кем ты хочешь стать?
// - Космонавтом!
// - А сколько тебе лет?
// - Леха!

import * as filtrationTemplate from '@home/filtration/filtration.hbs';
import '@home/filtration/filtration.css';
import type { AbstractComponent } from '@interfaces/components';
import type { FilterSearchParams } from '@interfaces/structs-data/filterSearchParams';

export default class FilterComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private rateFromInput: HTMLInputElement;

    private rateToInput: HTMLInputElement;

    private commentInput: HTMLInputElement;

    private percentInput: HTMLInputElement;

    private commentNumber: HTMLParagraphElement;

    private percentNumber: HTMLParagraphElement;

    private filterParams: FilterSearchParams;

    private inputIdTimer: number;

    constructor() {
        this.filterParams = {
            rateFrom: 0,
            rateTo: 5,
            percent: 0,
            comments: 0,
        };
        this.inputIdTimer = -1;
    }

    activate(): void {
        if (!this.place) {
            return;
        }

        this.render();
        this.getValues();
        this.subscribeEvents();
    }

    deactivate(): void {
        this.unsubscribeEvents();
        this.hide();
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    get filterParameters(): FilterSearchParams {
        if (this.filterParams.rateFrom > this.filterParams.rateTo) {
            const tmp = this.filterParams.rateFrom;
            this.filterParams.rateFrom = this.filterParams.rateTo;
            this.filterParams.rateTo = tmp;
        }
        return this.filterParams;
    }

    private getValues(): void {
        this.rateFromInput = document.getElementById('rate-from-input') as HTMLInputElement;
        this.rateToInput = document.getElementById('rate-to-input') as HTMLInputElement;
        this.commentInput = document.getElementById('comment-input') as HTMLInputElement;
        this.percentInput = document.getElementById('percent-input') as HTMLInputElement;
        this.commentNumber = document.getElementById('comment-number') as HTMLParagraphElement;
        this.percentNumber = document.getElementById('percent-number') as HTMLParagraphElement;
    }

    subscribeEvents(): void {
        this.commentInput.addEventListener('input', this.changeCommentInput);
        this.percentInput.addEventListener('input', this.changePercentInput);
        this.rateFromInput.addEventListener('input', this.changeRateFromInput);
        this.rateToInput.addEventListener('input', this.changeRateToInput);
    }

    unsubscribeEvents(): void {
        this.commentInput.removeEventListener('input', this.changeCommentInput);
        this.percentInput.removeEventListener('input', this.changePercentInput);
        this.rateFromInput.removeEventListener('input', this.changeRateFromInput);
        this.rateToInput.removeEventListener('input', this.changeRateToInput);
    }

    render(): void {
        window.scrollTo(0, 0);
        this.place.innerHTML = filtrationTemplate();
    }

    hide(): void {
        this.place.innerHTML = '';
    }

    private changeCommentInput = (): void => {
        this.commentNumber.innerText = `> ${this.commentInput.value}`;
        this.filterParams.comments = +this.commentInput.value;
    };

    private changePercentInput = (): void => {
        this.percentNumber.innerText = `> ${this.percentInput.value}%`;
        this.filterParams.percent = +this.percentInput.value;
    };

    private changeRateFromInput = (): void => {
        const value = +this.rateFromInput.value;
        if (+this.rateFromInput.value.length > 1 || Number.isNaN(value)) {
            this.renderInputError(this.rateFromInput);
            this.rateFromInput.value = '';
            return;
        }
        this.filterParams.rateFrom = value;
    };

    private changeRateToInput = (): void => {
        const value = +this.rateToInput.value;
        if (+this.rateToInput.value.length > 1 || Number.isNaN(value)) {
            this.renderInputError(this.rateToInput);
            this.rateToInput.value = '';
            return;
        }
        this.filterParams.rateTo = +this.rateToInput.value;
    };

    private renderInputError(input: HTMLInputElement): void {
        if (this.inputIdTimer !== -1) {
            window.clearTimeout(this.inputIdTimer);
            this.rateToInput.classList.remove('filtration__input-error');
            this.rateFromInput.classList.remove('filtration__input-error');
        }

        input.classList.add('filtration__input-error');
        this.inputIdTimer = window.setTimeout(() => {
            if (input) {
                input.classList.remove('filtration__input-error');
            }
            this.inputIdTimer = -1;
        }, 1000);
    }
}

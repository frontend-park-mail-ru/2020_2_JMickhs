import type { AbstractController } from '@interfaces/controllers';
import * as filtrationTemplate from '@home/filtration/filtration.hbs';
import '@home/filtration/filtration.css';

export default class FilterComponent implements AbstractController {
    private place?: HTMLDivElement;

    private rateFromInput: HTMLInputElement;

    private rateToInput: HTMLInputElement;

    private commentInput: HTMLInputElement;

    private percentInput: HTMLInputElement;

    private commentNumber: HTMLParagraphElement;

    private percentNumber: HTMLParagraphElement;

    private filterParams: Record<string, number>;

    constructor() {
        this.filterParams = {
            rateFrom: 0,
            rateTo: 5,
            percent: 100,
            comments: 0,
        };
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

    get filterParameters(): Record<string, number> {
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
        this.filterParams.rateFrom = +this.rateFromInput.value;// TODO: проверка на валидность
    };

    private changeRateToInput = (): void => {
        this.filterParams.rateTo = +this.rateToInput.value;// TODO: проверка на валидность
    };
}

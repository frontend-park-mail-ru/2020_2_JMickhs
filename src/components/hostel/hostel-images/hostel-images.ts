import type { HandlerEvent } from '@interfaces/functions';
import type { HostelData } from '@interfaces/structs-data/hostel-data';
import type { AbstractComponent } from '@interfaces/components';

import * as imagesTemplate from '@hostel/hostel-images/hostel-images.hbs';

export default class HostelImagesComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private image?: HTMLImageElement;

    private nextButton?: HTMLButtonElement;

    private prevButton?: HTMLButtonElement;

    private photos: string[];

    private currentPhoto: number;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.handlers = this.makeHandlers();
    }

    activate(hostel: HostelData): void {
        this.photos = hostel.photos || [];
        this.photos.unshift(hostel.image);
        this.currentPhoto = 0;

        this.render();

        this.nextButton = document.getElementById('button-image-next') as HTMLButtonElement;
        this.prevButton = document.getElementById('button-image-prev') as HTMLButtonElement;
        this.image = document.getElementById('cur-image') as HTMLImageElement;

        if (!this.image.complete) {
            this.buttonsDisabled(true);
        }

        this.subscribeEvents();
    }

    private makeHandlers(): Record<string, HandlerEvent> {
        return {
            prevImg: (event: Event): void => {
                event.preventDefault();

                this.nextImage();
            },
            nextImg: (event: Event): void => {
                event.preventDefault();

                this.prevImage();
            },
            loadingImage: (): void => {
                this.buttonsDisabled(false);
            },
        };
    }

    private subscribeEvents(): void {
        this.nextButton?.addEventListener('click', this.handlers.nextImg);
        this.prevButton?.addEventListener('click', this.handlers.prevImg);
        this.image?.addEventListener('load', this.handlers.loadingImage);
    }

    private unsubscribeEvents(): void {
        this.nextButton?.removeEventListener('click', this.handlers.nextImg);
        this.prevButton?.removeEventListener('click', this.handlers.prevImg);
        this.image?.removeEventListener('load', this.handlers.loadingImage);
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    private render(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = imagesTemplate({ image: this.photos[this.currentPhoto] });
    }

    private buttonsDisabled(disabled: boolean): void {
        this.nextButton.disabled = disabled;
        this.prevButton.disabled = disabled;
    }

    private nextImage(): void {
        this.currentPhoto += 1;
        if (this.currentPhoto === this.photos.length) {
            this.currentPhoto = 0;
        }

        this.buttonsDisabled(true);
        this.image.src = this.photos[this.currentPhoto];
    }

    private prevImage(): void {
        this.currentPhoto -= 1;
        if (this.currentPhoto === -1) {
            this.currentPhoto = this.photos.length - 1;
        }

        this.buttonsDisabled(true);
        this.image.src = this.photos[this.currentPhoto];
    }

    deactivate(): void {
        if (!this.place) {
            return;
        }

        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }
}

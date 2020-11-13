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
            this.buttonsActivate();
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
            loadImage: this.buttonsDisable.bind(this),
        };
    }

    private subscribeEvents(): void {
        this.nextButton?.addEventListener('click', this.handlers.nextImg);
        this.prevButton?.addEventListener('click', this.handlers.prevImg);
        this.image?.addEventListener('load', this.handlers.loadImage);
    }

    private unsubscribeEvents(): void {
        this.nextButton?.removeEventListener('click', this.handlers.nextImg);
        this.prevButton?.removeEventListener('click', this.handlers.prevImg);
        this.image?.removeEventListener('load', this.handlers.loadImage);
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

    private buttonsDisable(): void {
        this.nextButton.disabled = false;
        this.prevButton.disabled = false;
    }

    private buttonsActivate(): void {
        this.nextButton.disabled = true;
        this.prevButton.disabled = true;
    }

    private nextImage(): void {
        this.currentPhoto += 1;
        if (this.currentPhoto === this.photos.length) {
            this.currentPhoto = 0;
        }

        this.buttonsActivate();
        this.image.src = this.photos[this.currentPhoto];
    }

    private prevImage(): void {
        this.currentPhoto -= 1;
        if (this.currentPhoto === -1) {
            this.currentPhoto = this.photos.length - 1;
        }

        this.buttonsActivate();
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

import type { HostelData } from '@interfaces/structs-data/hostel-data';
import type { AbstractComponent } from '@interfaces/components';

import './hostel-images.css';
import * as imagesTemplate from '@hostel/hostel-images/hostel-images.hbs';

export default class HostelImagesComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private image?: HTMLImageElement;

    private nextButton?: HTMLButtonElement;

    private prevButton?: HTMLButtonElement;

    private photos: string[];

    private currentPhoto: number;

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

    private prevImageClick = (event: Event): void => {
        event.preventDefault();

        this.nextImage();
    };

    private nextImageClick = (event: Event): void => {
        event.preventDefault();

        this.prevImage();
    };

    private loadingImage = (): void => {
        // анимация
        this.buttonsDisabled(false);
    };

    private subscribeEvents(): void {
        this.nextButton?.addEventListener('click', this.nextImageClick);
        this.prevButton?.addEventListener('click', this.prevImageClick);
        this.image?.addEventListener('load', this.loadingImage);
    }

    private unsubscribeEvents(): void {
        this.nextButton?.removeEventListener('click', this.nextImageClick);
        this.prevButton?.removeEventListener('click', this.prevImageClick);
        this.image?.removeEventListener('load', this.loadingImage);
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
        if (this.nextButton || this.prevButton) {
            this.nextButton.disabled = disabled;
            this.prevButton.disabled = disabled;
        }
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

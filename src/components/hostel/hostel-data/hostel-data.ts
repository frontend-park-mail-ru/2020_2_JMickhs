import { HostelData } from '@interfaces/structsData/hostelData';

import * as dataTemplate from '@hostel/hostel-data/hostel-data.hbs';
import * as imagesTemplate from '@hostel/hostel-data/hostel-images.hbs';

import Events from '@eventBus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
} from '@eventBus/constants';
import { AbstractComponent } from '@interfaces/components';
import { HandlerEvent } from '@interfaces/functions';

export default class HostelDataComponent implements AbstractComponent {
    private placeData: HTMLDivElement;

    private placeImages: HTMLDivElement;

    private image: HTMLImageElement;

    private photos: string[];

    private currentPhoto: number;

    private hostel: HostelData;

    private handlers: Record<string, HandlerEvent>;

    constructor() {
        this.handlers = this.makeHandlers();
    }

    setPlace(placeText: HTMLDivElement, placePhotos: HTMLDivElement): void {
        this.placeData = placeText;
        this.placeImages = placePhotos;
    }

    activate(hostel: HostelData): void {
        if (!this.placeData || !this.placeImages) {
            return;
        }

        this.hostel = hostel;

        this.photos = hostel.photos;
        this.photos.unshift(hostel.image);
        this.currentPhoto = 0;
        const [imagePath] = this.photos;
        this.hostel.image = imagePath;

        this.render(this.hostel);
    }

    private render(hostel: HostelData): void {
        this.placeData.innerHTML = dataTemplate(hostel);
        this.placeImages.innerHTML = imagesTemplate(hostel);

        this.image = document.getElementById('cur-image') as HTMLImageElement;

        this.subscribeEvents();
    }

    private nextImage(): void {
        this.currentPhoto += 1;
        if (this.currentPhoto === this.photos.length) {
            this.currentPhoto = 0;
        }

        this.image.src = this.photos[this.currentPhoto];
    }

    private prevImage(): void {
        this.currentPhoto -= 1;
        if (this.currentPhoto === -1) {
            this.currentPhoto = this.photos.length - 1;
        }

        this.image.src = this.photos[this.currentPhoto];
    }

    deactivate(): void {
        this.unsubscribeEvents();

        this.placeData.innerHTML = '';
        this.placeImages.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);

        const buttonNext = document.getElementById('button-image-next');
        buttonNext.addEventListener('click', this.handlers.nextImg);
        const buttonPrev = document.getElementById('button-image-prev');
        buttonPrev.addEventListener('click', this.handlers.prevImg);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);

        const buttonNext = document.getElementById('button-image-next');
        buttonNext.removeEventListener('click', this.handlers.nextImg);
        const buttonPrev = document.getElementById('button-image-prev');
        buttonPrev.removeEventListener('click', this.handlers.prevImg);
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
            updateTextData: (arg: {rating: number, delta: number}): void => {
                this.hostel.countComments += arg.delta;
                this.hostel.rating = arg.rating;

                this.placeData.innerHTML = dataTemplate(this.hostel);
            },
        };
    }
}

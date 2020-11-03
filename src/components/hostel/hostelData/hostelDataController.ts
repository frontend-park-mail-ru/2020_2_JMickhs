import { AbstractController } from '@interfaces/controllers';
import { HostelData } from '@interfaces/structsData/hostelData';

import * as dataTemplate from '@hostel/templates/hostelData.hbs';
import * as imagesTemplate from '@hostel/templates/hostelImages.hbs';

import Events from '@eventBus/eventbus';
import {
    UPDATE_RATING_HOSTEL,
} from '@eventBus/constants';

export default class HostelDataController implements AbstractController {
    private placeData: HTMLElement;

    private placeImages: HTMLElement;

    private image: HTMLImageElement;

    private photos: string[];

    private curPhoto: number;

    private hostel: HostelData;

    private handlers: Record<string, (arg: unknown) => void>;

    constructor() {
        this.handlers = {
            prevImg: (evt: Event) => {
                evt.preventDefault();

                this.nextImage();
            },
            nextImg: (evt: Event) => {
                evt.preventDefault();

                this.prevImage();
            },
            updateTextData: (arg: {rating: number, delta: number}) => {
                this.hostel.countComments += arg.delta;
                this.hostel.rating = arg.rating;

                this.placeData.innerHTML = dataTemplate(this.hostel);
            },
        };
    }

    activate(arg: {placeData: HTMLElement, placeImages: HTMLElement, hostel: HostelData}): void {
        this.placeData = arg.placeData;
        this.placeImages = arg.placeImages;
        this.hostel = arg.hostel;

        this.photos = arg.hostel.photos;
        this.photos.unshift(arg.hostel.image);
        this.curPhoto = 0;

        const image = this.photos[0];
        this.hostel.image = image;

        this.render(this.hostel);
    }

    private render(hostel: HostelData) {
        this.placeData.innerHTML = dataTemplate(hostel);
        this.placeImages.innerHTML = imagesTemplate(hostel);

        this.image = document.getElementById('cur-image') as HTMLImageElement;

        this.subscribeEvents();
    }

    private nextImage() {
        this.curPhoto += 1;
        if (this.curPhoto === this.photos.length) {
            this.curPhoto = 0;
        }

        this.image.src = this.photos[this.curPhoto];
    }

    private prevImage() {
        this.curPhoto -= 1;
        if (this.curPhoto === -1) {
            this.curPhoto = this.photos.length - 1;
        }

        this.image.src = this.photos[this.curPhoto];
    }

    deactivate(): void {
        this.unsubscribeEvents();

        this.placeData.innerHTML = '';
        this.placeImages.innerHTML = '';
    }

    private subscribeEvents(): void {
        Events.subscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);

        const btnNext = document.getElementById('btn-image-next');
        btnNext.addEventListener('click', this.handlers.nextImg);
        const btnPrev = document.getElementById('btn-image-prev');
        btnPrev.addEventListener('click', this.handlers.prevImg);
    }

    private unsubscribeEvents(): void {
        Events.unsubscribe(UPDATE_RATING_HOSTEL, this.handlers.updateTextData);

        const btnNext = document.getElementById('btn-image-next');
        btnNext.removeEventListener('click', this.handlers.nextImg);
        const btnPrev = document.getElementById('btn-image-prev');
        btnPrev.removeEventListener('click', this.handlers.prevImg);
    }
}

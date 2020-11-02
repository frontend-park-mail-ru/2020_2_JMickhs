import { AbstractController } from "@interfaces/controllers";
import { HostelData } from "@interfaces/structsData/hostelData";

import * as dataTemplate from "@hostel/templates/hostelData.hbs";
import * as imagesTemplate from "@hostel/templates/hostelImages.hbs";

export default class HostelDataController implements AbstractController {

    private placeData: HTMLElement;
    private placeImages: HTMLElement;
    private image: HTMLImageElement;

    private photos: string[];
    private curPhoto: number;

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
        };
    }

    activate(arg: {placeData: HTMLElement, placeImages: HTMLElement, hostel: HostelData}): void {
        this.placeData = arg.placeData;
        this.placeImages = arg.placeImages;

        this.photos = arg.hostel.photos;
        this.photos.unshift(arg.hostel.image);
        this.curPhoto = 0;
        arg.hostel.image = this.photos[0];
        
        this.render(arg.hostel);
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
        // Events.trigger(UPDATE_RATING_HOSTEL, this.comment.rating);

        const btnNext = document.getElementById('btn-image-next');
        btnNext.addEventListener('click', this.handlers.nextImg);
        const btnPrev = document.getElementById('btn-image-prev');
        btnPrev.addEventListener('click', this.handlers.prevImg);
    }

    private unsubscribeEvents(): void {
        const btnNext = document.getElementById('btn-image-next');
        btnNext.removeEventListener('click', this.handlers.nextImg);
        const btnPrev = document.getElementById('btn-image-prev');
        btnPrev.removeEventListener('click', this.handlers.prevImg);
    }
}
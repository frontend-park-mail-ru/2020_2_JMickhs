import type { AbstractComponent } from '@interfaces/components';

import * as templateContainer from '@hostel/comment-images/container-images.hbs';
import './comment-images.css';

export default class CommentImagesComponent implements AbstractComponent {
    private arrayImages: string[];

    private place?: HTMLDivElement;

    private container: HTMLDivElement;

    constructor() {
        this.arrayImages = [];
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = templateContainer();
        this.container = document.getElementById('container-comment-images') as HTMLDivElement;
    }

    private addImage(image: string): void {
        this.container.innerHTML += `<p>Изображение${image}</p>`;
    }

    deactivate(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = '';
    }
}

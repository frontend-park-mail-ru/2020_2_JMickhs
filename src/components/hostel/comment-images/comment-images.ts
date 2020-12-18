import type { AbstractComponent } from '@interfaces/components';

import * as templateContainer from '@hostel/comment-images/container-images.hbs';

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

    private addImage(): void {
        this.container.innerHTML += '<p>Изображение</p>';
    }

    deactivate(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = '';
    }
}

import type { AbstractComponent } from '@interfaces/components';

import * as templateContainer from '@hostel/comment-images/container-images.hbs';
import * as templateImage from '@hostel/comment-images/comment-images.hbs';
import './comment-images.css';

export default class CommentImagesComponent implements AbstractComponent {
    private place?: HTMLDivElement;

    private container?: HTMLDivElement;

    count = 0;

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

    addImage(image: string): void {
        if (!this.container) {
            return;
        }

        this.container.innerHTML += templateImage({ id: `comment-image-${this.count}`, src: image });
        this.count += 1;
    }

    clear = (): void => {
        if (!this.container) {
            return;
        }

        this.container.innerHTML = '';
    };

    deactivate(): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = '';
    }
}

import type { AbstractComponent } from '@interfaces/components';
import { Loader } from 'google-maps';

import * as template from './map.hbs';
import './map.css';

const mapApiKey = 'AIzaSyDRvlTULyQ1ADfqMmVTSrzt-y9_8DyETkc';

export default class MapComponent implements AbstractComponent {
    private loader: Loader;

    private map: google.maps.Map;

    private marker: google.maps.Marker;

    private place?: HTMLDivElement;

    private loaded: boolean;

    constructor() {
        this.loader = new Loader(mapApiKey);
        this.loaded = false;
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(latitude: number, longitude: number): void {
        if (!this.place) {
            return;
        }

        this.place.innerHTML = template();

        if (this.loaded) {
            this.render(latitude, longitude);
        } else {
            this.loader.load().then(() => {
                this.render(latitude, longitude);
                this.loaded = true;
            }).catch(() => {
                this.renderError('Извините, в данный момент карта не доступна');
            });
        }
    }

    private render(latitude: number, longitude: number): void {
        const point = { lat: latitude, lng: longitude };
        this.map = new google.maps.Map(document.getElementById('map-container') as HTMLDivElement, {
            center: point,
            zoom: 15,
        });
        this.marker = new google.maps.Marker({
            position: point,
            map: this.map,
        });
    }

    private renderError(err: string): void {
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerText = err;
        mapContainer.classList.remove('map__container');
        mapContainer.classList.add('map__error-container');
    }

    deactivate(): void {
        this.place.innerHTML = '';
    }
}

import type { AbstractComponent } from '@interfaces/components';
import { Loader } from 'google-maps';

import * as template from './map.hbs';
import './map.css';

export default class MapComponent implements AbstractComponent {
    private loader: Loader;

    private map?: google.maps.Map;

    private hostel?: google.maps.LatLng;

    private marker?: google.maps.Marker;

    private place?: HTMLDivElement;

    private loaded: boolean;

    constructor() {
        // в том, что мы просто передаем ключ ничего страшного, поставлено ограничение на домен
        this.loader = new Loader('AIzaSyDRvlTULyQ1ADfqMmVTSrzt-y9_8DyETkc');
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

    deactivate(): void {
        this.place.innerHTML = '';
    }
}

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

    constructor() {
        this.loader = new Loader('AIzaSyDRvlTULyQ1ADfqMmVTSrzt-y9_8DyETkc');
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(latitude: number, longitude: number): void {
        if (!this.place) {
            return;
        }

        const button = document.createElement('button');
        button.classList.add('map__button');
        button.innerText = 'Load map';
        this.place.appendChild(button);

        button.addEventListener('click', async () => {
            button.innerText = 'Loading…';
            button.disabled = true;
            this.place.innerHTML = template();
            const hostel = { lat: latitude, lng: longitude };
            this.loader.load().then(() => {
                this.map = new google.maps.Map(document.getElementById('map-container') as HTMLDivElement, {
                    center: { lat: latitude, lng: longitude },
                    zoom: 15,
                });
                this.marker = new google.maps.Marker({
                    position: hostel,
                    map: this.map,
                    label: 's',
                });
            });
        });
    }

    deactivate(): void {
        document.getElementById('map-google').innerHTML = '';
    }
}

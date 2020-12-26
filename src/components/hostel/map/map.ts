// — Слышал, Абдула разводится с Зухрой!
// — С чего это он? Разлюбил, что ли?
// — Любит, да вот беда: надел на жену пояс верности, а ключ потерял!

import type { AbstractComponent } from '@interfaces/components';
import { Loader } from 'google-maps';

import './map.css';
import NetworkHostel from '@/helpers/network/network-hostel';
import type HotelInfo from '@network/structs-server/hotel-info';
import Redirector from '@/helpers/router/redirector';
import * as template from './map.hbs';

const MAP_API_KEY = 'AIzaSyDRvlTULyQ1ADfqMmVTSrzt-y9_8DyETkc';

const ERROR_LOAD_HOSTELS = 'Не удалось загрузить отели';

export default class MapComponent implements AbstractComponent {
    private loader: Loader;

    private map: google.maps.Map;

    private place?: HTMLDivElement;

    private loaded: boolean;

    private readonly equator = 40075696;

    private markers: Map<number, HotelInfo>;

    private eventHandlers: Array<google.maps.MapsEventListener>;

    private onClose: () => void;

    constructor() {
        this.loader = new Loader(MAP_API_KEY);
        this.loaded = false;
        this.markers = new Map<number, HotelInfo>();
        this.eventHandlers = [];
    }

    setPlace(place: HTMLDivElement): void {
        this.place = place;
    }

    activate(latitude: number, longitude: number, onClose: () => void): void {
        if (!this.place) {
            return;
        }
        this.onClose = onClose;

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
            zoom: 16,
            minZoom: 13,
        });

        this.subscribeEvents();
        this.loadHostels();
    }

    private loadHostels = (): void => {
        const center = this.map.getCenter();
        const response = NetworkHostel.getHostelsByRadius(this.equator / (this.map.getZoom() * 10),
            center.lat(),
            center.lng());
        response.then((value) => {
            const { code } = value;
            if (code === 200) {
                const data = value.data as {
                    hotels: HotelInfo[];
                };
                this.addMarkers(data.hotels);
            } else {
                this.renderError(ERROR_LOAD_HOSTELS);
            }
        });
    };

    private addMarkers(hostels: HotelInfo[]): void {
        hostels.forEach((hostel) => {
            const point = new google.maps.LatLng(hostel.latitude, hostel.longitude);
            if (this.markers.has(hostel.latitude)) {
                return;
            }
            const marker = new google.maps.Marker({
                map: this.map,
                position: point,
                animation: google.maps.Animation.DROP,
            });
            this.eventHandlers.push(marker.addListener('click', (): void => {
                const hotel = this.markers.get(marker.getPosition().lat());
                this.deactivate();
                this.onClose();
                Redirector.redirectTo(`/hostel/?id=${hotel.hotel_id}`);
            }));
            this.markers.set(hostel.latitude, hostel);
        });
    }

    private renderError(err: string): void {
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerText = err;
        mapContainer.classList.remove('map__container');
        mapContainer.classList.add('map__error-container');
    }

    private subscribeEvents(): void {
        this.eventHandlers.push(this.map.addListener('zoom_changed', this.loadHostels));
        this.eventHandlers.push(this.map.addListener('dragend', this.loadHostels));
    }

    private unsubscribeEvents(): void {
        this.eventHandlers.forEach((handler) => {
            handler.remove();
        });
        this.eventHandlers = [];
    }

    deactivate(): void {
        if (!this.place) {
            return;
        }
        this.markers.clear();
        this.unsubscribeEvents();
        this.place.innerHTML = '';
    }
}

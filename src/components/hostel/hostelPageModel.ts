import {HostelData} from '@interfaces/hostelData';
import Network from '@network/network';
import Events from '@eventBus/eventbus';
import {
    REDIRECT_ERROR,
    UPDATE_HOSTEL,
} from '@eventBus/constants';

export default class HostelPageModel {
    private name: string;
    private id: number;
    private image: string;
    private photos: string[];
    private location: string;
    private rating: number;
    private description: string;

    constructor() {
        this. id = -1;
    }

    haveHostel(id: number): boolean {
        if (id <= 0) {
            return false;
        }
        return id == this.id;
    }

    getData(): HostelData {
        const data = {
            name: this.name,
            id: this.id,
            image: this.image,
            photos: this.photos,
            location: this.location,
            rating: this.rating,
            description: this.description,
        }
        return data;
    }

    fillModel(id: number): void {
        if (id <= 0) {
            Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
        }
        
        const response = Network.getHostel(id);
        response.then((response) => {
            const hostel = response.data.hotel;
            const code = response.code;
            switch (code) {
            case 200:
                this.description = hostel.description;
                this.id = hostel.hotel_id;
                this.name = hostel.name;
                this.image = Network.getUrlFile(hostel.image);
                this.location = hostel.location;
                Events.trigger(UPDATE_HOSTEL, this.getData());
                break;
            case 400:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
                break;
            case 410:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Такого отеля не существует'});
                break;
            default:
                Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Что-то страшное произошло c нишим сервером...' +
                        ` Он говорит: ${code}`});
                break;
            }
        });
    }
}
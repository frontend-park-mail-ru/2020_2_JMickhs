import {HostelData} from '@interfaces/structsData/hostelData';
import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    REDIRECT_ERROR,
    UPDATE_HOSTEL,
} from '@eventBus/constants';
import HotelFromServer from '@network/structsServer/HotelData';

export default class HostelPageModel {
    
    private name: string;
    private id: number;
    private image: string;
    private photos: string[];
    private location: string;
    private rating: number;
    private description: string;
    private countComments: number;

    constructor() {
        this.id = -1;
    }

    haveHostel(id: number): boolean {
        if (id <= 0) {
            return false;
        }
        return id == this.id;
    }

    getData(): HostelData {
        return {
            name: this.name,
            id: this.id,
            image: this.image,
            photos: this.photos,
            location: this.location,
            rating: this.rating,
            description: this.description,
            countComments: this.countComments,
        };
    }

    fillModel(id: number): void {
        if (id <= 0) {
            Events.trigger(REDIRECT_ERROR, {url: '/error', err: 'Неверный формат запроса'});
        }
        
        const response = NetworkHostel.getHostel(id);
        response.then((response) => {
            const code = response.code;
            switch (code) {
            case 200:
                const data = response.data as HotelFromServer;
                const hostel = data.hotel;
                this.description = hostel.description;
                this.id = hostel.hotel_id;
                this.name = hostel.name;
                this.image = hostel.image;
                this.photos = hostel.photos;
                this.location = hostel.location;
                this.countComments = hostel.comm_count;
                this.rating = hostel.rating;
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
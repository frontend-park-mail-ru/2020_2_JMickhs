import {HostelData} from '@interfaces/structsData/hostelData';
import { CommentData } from "@interfaces/structsData/commentData";
import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    REDIRECT_ERROR,
    UPDATE_HOSTEL,
} from '@eventBus/constants';
import HotelFromServer from '@network/structsServer/HotelData';

export default class HostelPageModel {

    private hostel: HostelData;
    private comment: CommentData;

    constructor() {
        this.hostel = {};
        this.comment = {};
    }

    getHostel(): HostelData {
        return this.hostel;
    }

    getComment(): CommentData {
        return this.comment;
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
                const hotel = data.hotel;
                this.hostel.description = hotel.description;
                this.hostel.id = hotel.hotel_id;
                this.hostel.name = hotel.name;
                this.hostel.image = hotel.image;
                this.hostel.photos = hotel.photos;
                this.hostel.location = hotel.location;
                this.hostel.countComments = hotel.comm_count;
                this.hostel.rating = hotel.rating;

                this.comment = data.comment;

                Events.trigger(UPDATE_HOSTEL, {hostel: this.hostel, comment: this.comment});
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
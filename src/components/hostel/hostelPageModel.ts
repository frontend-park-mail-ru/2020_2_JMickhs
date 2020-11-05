import { HostelData } from '@interfaces/structsData/hostelData';
import { CommentData } from '@/helpers/network/structsServer/commentData';
import NetworkHostel from '@network/networkHostel';
import Events from '@eventBus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@eventBus/constants';
import Redirector from '@router/redirector';
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

    private setHostel(data: HotelFromServer): void {
        const { hotel } = data;
        this.hostel.description = hotel.description;
        this.hostel.id = hotel.hotel_id;
        this.hostel.name = hotel.name;
        this.hostel.image = hotel.image;
        this.hostel.photos = hotel.photos;
        this.hostel.location = hotel.location;
        this.hostel.countComments = hotel.comm_count;
        this.hostel.rating = hotel.rating;
    }

    fillModel(id: number): void {
        if (id <= 0) {
            Redirector.redirectError('Такого отеля не существует');
        }

        const response = NetworkHostel.getHostel(id);
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as HotelFromServer;
                    this.setHostel(data);

                    this.comment = data.comment;

                    Events.trigger(UPDATE_HOSTEL, { hostel: this.hostel, comment: this.comment });
                    break;
                case 400:
                    Redirector.redirectError('Неверный формат запроса');
                    break;
                case 410:
                    Redirector.redirectError('Такого отеля не существует');
                    break;
                default:
                    Redirector.redirectError(`Ошибка сервера: ${code}`);
                    break;
            }
        });
    }
}

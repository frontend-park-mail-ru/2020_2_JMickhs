import type { HostelData } from '@/helpers/interfaces/structs-data/hostel-data';
import type { CommentData } from '@/helpers/network/structs-server/comment-data';
import NetworkHostel from '@/helpers/network/network-hostel';
import Events from '@eventbus/eventbus';
import {
    UPDATE_HOSTEL,
} from '@eventbus/constants';
import Redirector from '@router/redirector';
import type HotelFromServer from '@/helpers/network/structs-server/hotel-data';
import User from '@user/user';
import { ERROR_400, ERROR_DEFAULT } from '@global-variables/network-error';

const ERROR_ID_HOSTEL = 'Такого отеля не существует';

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
        this.hostel.latitude = hotel.latitude;
        this.hostel.longitude = hotel.longitude;
    }

    fillModel(id: number): void {
        if (id <= 0) {
            Redirector.redirectError(ERROR_ID_HOSTEL);
        }

        const response = NetworkHostel.getHostel(id);
        response.then((value) => {
            const { code } = value;
            switch (code) {
                case 200:
                    const data = value.data as HotelFromServer;
                    this.setHostel(data);

                    this.comment = data.comment;

                    Events.trigger(UPDATE_HOSTEL, { isAuth: User.isAuth, hostel: this.hostel, comment: this.comment });
                    break;
                case 400:
                    Redirector.redirectError(ERROR_400);
                    break;
                case 410:
                    Redirector.redirectError(ERROR_ID_HOSTEL);
                    break;
                default:
                    Redirector.redirectError(`${ERROR_DEFAULT}${code}`);
                    break;
            }
        });
    }
}

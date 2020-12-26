import type { CommentData } from '@/helpers/network/structs-server/comment-data';
import type HotelInfo from './hotel-info';

interface HotelData {
    hotel: HotelInfo;
    comment: CommentData;
}

export default HotelData;

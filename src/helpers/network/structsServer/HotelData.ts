import { CommentData } from "@/helpers/network/structsServer/commentData";

interface HotelData {
    hotel: {
        description: string,
        hotel_id: number;
        name: string;
        image: string;
        photos: string[];
        location: string;
        rating: number;
        comm_count: number;
    }
    comment: CommentData;
}

export default HotelData;
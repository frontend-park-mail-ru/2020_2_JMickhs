interface HotelData {
    hotel: {
        description: string,
        hotel_id: number;
        name: string;
        image: string;
        photos: string[];
        location: string;
        comm_count: number;
    }
}

export default HotelData;
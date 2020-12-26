interface HotelInfo {
    description: string,
    hotel_id: number;
    name: string;
    image: string;
    photos: string[];
    location: string;
    rating: number;
    comm_count: number;
    latitude: number;
    longitude: number;
}

export default HotelInfo;

export interface HostelData {
    name?: string;
    id?: number;
    image?: string;
    photos?: string[];
    location?: string;
    rating?: number;
    description?: string;
    countComments?: number;
    latitude?: number;
    longitude?: number;
}

export interface Coordinate {
    latitude?: number;
    longitude?: number;
}

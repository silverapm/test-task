export type DestinationType = 'country' | 'city' | 'hotel';

export type Destination = {
    id: string | number;
    type: DestinationType;
    name: string;
    flag?: string;
    countryId?: string;
    cityId?: number;
    countryName?: string;
    cityName?: string;
    img?: string;
};

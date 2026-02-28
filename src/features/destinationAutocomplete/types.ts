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

export type DestinationAutocompleteProps = {
    value: Destination | null;
    onChange: (next: Destination | null) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
};

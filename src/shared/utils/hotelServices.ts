export type HotelServiceKey =
    | 'wifi'
    | 'aquapark'
    | 'tennis_court'
    | 'laundry'
    | 'parking';

export const HOTEL_SERVICE_LABELS: Record<HotelServiceKey, string> = {
    wifi: 'Wi-Fi',
    aquapark: 'Aquapark',
    tennis_court: 'Tennis court',
    laundry: 'Laundry',
    parking: 'Parking',
};

export const HOTEL_SERVICE_ICONS: Record<HotelServiceKey, string> = {
    wifi: '📶',
    aquapark: '🏄',
    tennis_court: '🎾',
    laundry: '🧺',
    parking: '🅿️',
};

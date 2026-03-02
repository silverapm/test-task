import type { RootState } from '../../../app/store';
import { getCountryIdFromCriteria } from '../../../shared/utils/searchCriteria';

export const selectTourSearch = (state: RootState) => state.tourSearch;

export type TourCardModel = {
    priceId: string;
    hotelId: number;
    title: string;
    location: string;
    imageUrl: string | null;
    startDate: string;
    endDate: string;
    amount: number;
    currency: 'usd';
};

export const selectTourCards = (state: RootState): TourCardModel[] => {
    const search = state.tourSearch;

    if (search.status !== 'success') return [];

    const countryId = getCountryIdFromCriteria(search.criteria);
    if (!countryId) return [];

    const hotelsMap = state.hotel.hotelsByCountryId[countryId] ?? {};

    return search.priceIds.map((priceId) => {
        const price = search.pricesById[priceId];
        const hotel = hotelsMap[String(price.hotelID)];

        const title = hotel?.name ?? `Hotel #${price.hotelID}`;
        const location =
            hotel ? `${hotel.countryName}, ${hotel.cityName}` : '—';

        return {
            priceId: price.id,
            hotelId: price.hotelID,
            title,
            location,
            imageUrl: hotel?.img ?? null,
            startDate: price.startDate,
            endDate: price.endDate,
            amount: price.amount,
            currency: 'usd',
        };
    });
};

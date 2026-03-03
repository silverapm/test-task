import { createSelector } from '@reduxjs/toolkit';
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

const selectTourStatus = (state: RootState) => state.tourSearch.status;
const selectTourCriteria = (state: RootState) => state.tourSearch.criteria;
const selectPriceIds = (state: RootState) => state.tourSearch.priceIds;
const selectPricesById = (state: RootState) => state.tourSearch.pricesById;
const selectHotelsByCountryId = (state: RootState) => state.hotel.hotelsByCountryId;

export const selectTourCards = createSelector(
    [selectTourStatus, selectTourCriteria, selectPriceIds, selectPricesById, selectHotelsByCountryId],
    (status, criteria, priceIds, pricesById, hotelsByCountryId): TourCardModel[] => {
        if (status !== 'success') return [];

        const countryId = getCountryIdFromCriteria(criteria);
        if (!countryId) return [];

        const hotelsMap = hotelsByCountryId[countryId] ?? {};

        return priceIds.map((priceId) => {
            const price = pricesById[priceId];
            const hotel = hotelsMap[String(price.hotelID)];

            const title = hotel?.name ?? `Hotel #${price.hotelID}`;
            const location = hotel ? `${hotel.countryName}, ${hotel.cityName}` : '—';

            return {
                priceId: price.id,
                hotelId: Number(price.hotelID),
                title,
                location,
                imageUrl: hotel?.img ?? null,
                startDate: price.startDate,
                endDate: price.endDate,
                amount: price.amount,
                currency: 'usd',
            };
        });
    }
);

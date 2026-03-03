import type { Destination } from '../../destination/model/types';

export type Currency = 'usd';

export type Price = {
    id: string;
    amount: number;
    currency: Currency;
    startDate: string;
    endDate: string;
    hotelID: number;
};

export type SearchStatus = 'idle' | 'loading' | 'error' | 'success' | 'empty' | 'cancelling';

export type SearchCriteria = {
    destination: Destination;
};

export type TourSearchState = {
    status: SearchStatus;
    criteria: SearchCriteria | null;
    token: string | null;
    waitUntil: string | null;
    pricesById: Record<string, Price>;
    priceIds: string[];
    errorMessage: string | null;
    activeRequestId: string | null;
};

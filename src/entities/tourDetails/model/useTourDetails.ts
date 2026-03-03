import { useEffect, useState } from 'react';
import * as api from '../../../shared/api/api.js';
import { parseJson } from '../../../shared/utils/api';

type PriceDetails = {
    id: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
};

type HotelDetails = {
    id: number;
    name: string;
    img?: string;
    countryName?: string;
    cityName?: string;
    description?: string;
    services?: Record<string, string>;
};

type State =
    | { status: 'loading' }
    | { status: 'error'; message: string }
    | { status: 'success'; price: PriceDetails; hotel: HotelDetails };

export function useTourDetails(priceId: string | undefined, hotelId: number | null) {
    const [state, setState] = useState<State>({ status: 'loading' });
    const [retryKey, setRetryKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            if (!priceId) {
                setState({ status: 'error', message: 'Missing priceId in URL.' });
                return;
            }

            if (!hotelId || Number.isNaN(hotelId)) {
                setState({ status: 'error', message: 'Missing hotelId in URL.' });
                return;
            }

            setState({ status: 'loading' });

            try {
                const [priceResp, hotelResp] = await Promise.all([
                    api.getPrice(priceId),
                    api.getHotel(hotelId),
                ]);

                const price = await parseJson<PriceDetails>(priceResp);
                const hotel = await parseJson<HotelDetails>(hotelResp);

                if (cancelled) return;

                setState({ status: 'success', price, hotel });
            } catch (err) {
                if (cancelled) return;

                const message = err instanceof Error ? err.message : 'Failed to load tour details.';
                setState({ status: 'error', message });
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [priceId, hotelId, retryKey]);

    function retry() {
        setRetryKey((x) => x + 1);
    }

    return { state, retry };
}

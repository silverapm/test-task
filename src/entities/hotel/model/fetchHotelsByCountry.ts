import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../../shared/api/api.js';
import { parseJson } from '../../../shared/utils/api';
import type { RootState } from '../../../app/store';
import type { Hotel } from './types';

export const fetchHotelsByCountry = createAsyncThunk<
    { countryId: string; hotels: Record<string, Hotel> },
    { countryId: string },
    { state: RootState; rejectValue: string }
>('hotel/fetchHotelsByCountry', async ({ countryId }, { getState, rejectWithValue }) => {
    const state = getState().hotel;

    // cache: if already loaded for this country -> skip
    if (state.hotelsByCountryId[countryId]) {
        return rejectWithValue('SKIP_CACHED');
    }

    try {
        const resp = await api.getHotels(countryId);
        const hotels = await parseJson<Record<string, Hotel>>(resp);

        return { countryId, hotels };
    } catch {
        return rejectWithValue('Failed to load hotels.');
    }
});

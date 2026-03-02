import { createSlice } from '@reduxjs/toolkit';
import type { Hotel } from './types';
import { fetchHotelsByCountry } from './fetchHotelsByCountry';

type HotelsState = {
    hotelsByCountryId: Record<string, Record<string, Hotel>>;
    loadingByCountryId: Record<string, boolean>;
    errorByCountryId: Record<string, string | null>;
};

const initialState: HotelsState = {
    hotelsByCountryId: {},
    loadingByCountryId: {},
    errorByCountryId: {},
};

export const hotelSlice = createSlice({
    name: 'hotel',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchHotelsByCountry.pending, (state, action) => {
                state.loadingByCountryId[action.meta.arg.countryId] = true;
                state.errorByCountryId[action.meta.arg.countryId] = null;
            })
            .addCase(fetchHotelsByCountry.fulfilled, (state, action) => {
                state.hotelsByCountryId[action.payload.countryId] = action.payload.hotels;
                state.loadingByCountryId[action.payload.countryId] = false;
                state.errorByCountryId[action.payload.countryId] = null;
            })
            .addCase(fetchHotelsByCountry.rejected, (state, action) => {
                const countryId = action.meta.arg.countryId;
                const msg = action.payload;

                // cached -> do nothing
                if (msg === 'SKIP_CACHED') return;

                state.loadingByCountryId[countryId] = false;
                state.errorByCountryId[countryId] = msg ?? 'Failed to load hotels.';
            });
    },
});

export const hotelReducer = hotelSlice.reducer;

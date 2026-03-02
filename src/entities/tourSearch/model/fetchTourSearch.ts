import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../../shared/api/api.js';
import type { RootState } from '../../../app/store';
import type { Destination } from '../../../features/destinationAutocomplete/types';
import { getCountryId } from '../../../shared/utils/destination';
import { parseJson } from '../../../shared/utils/api';
import type { Price } from './types';
import { fetchHotelsByCountry } from '../../hotel/model/fetchHotelsByCountry';
import { pollSearchPrices } from '../../../shared/utils/pollSearchPrices';

type StartSearchResponse = {
    token: string;
    waitUntil: string;
};

export const fetchTourSearch = createAsyncThunk<
    { token: string; waitUntil: string; prices: Price[] },
    { destination: Destination },
    { state: RootState; rejectValue: string }
>('tourSearch/fetchTourSearch', async ({ destination }, { getState, rejectWithValue, signal, dispatch }) => {
    const state = getState().tourSearch;

    const isSameCriteria =
        state.status === 'success' &&
        state.criteria?.destination.id === destination.id &&
        state.criteria?.destination.type === destination.type;

    if (isSameCriteria) {
        return rejectWithValue('SKIP_SAME_CRITERIA');
    }

    const countryId = getCountryId(destination);
    if (!countryId) return rejectWithValue('Country id is missing for selected destination.');

    try {
        const startResp = await api.startSearchPrices(countryId);
        const startBody = await parseJson<StartSearchResponse>(startResp);

        const token = startBody.token;
        const waitUntil = startBody.waitUntil;

        // Preload hotels for this country (cached in store). No need to await.
        void dispatch(fetchHotelsByCountry({ countryId }));

        const prices = await pollSearchPrices(token, waitUntil, signal);

        return { token, waitUntil, prices };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to start search.';
        return rejectWithValue(message);
    }
});

import { createSlice } from '@reduxjs/toolkit';
import type { TourSearchState } from './types';
import { fetchTourSearch } from './fetchTourSearch.ts';

const initialState: TourSearchState = {
    status: 'idle',
    criteria: null,

    token: null,
    waitUntil: null,

    pricesById: {},
    priceIds: [],

    errorMessage: null,
};

export const tourSearchSlice = createSlice({
    name: 'tourSearch',
    initialState,
    reducers: {
        reset() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTourSearch.pending, (state, action) => {
                state.status = 'loading';
                state.errorMessage = null;
                state.criteria = { destination: action.meta.arg.destination };
                state.token = null;
                state.waitUntil = null;
                state.pricesById = {};
                state.priceIds = [];
            })
            .addCase(fetchTourSearch.fulfilled, (state, action) => {
                state.token = action.payload.token;
                state.waitUntil = action.payload.waitUntil;

                const list = action.payload.prices;

                if (list.length === 0) {
                    state.status = 'empty';
                    state.pricesById = {};
                    state.priceIds = [];
                    return;
                }

                state.status = 'success';
                state.pricesById = Object.fromEntries(list.map((p) => [p.id, p]));
                state.priceIds = list.map((p) => p.id);
            })
            .addCase(fetchTourSearch.rejected, (state, action) => {
                const msg = action.payload;

                if (msg === 'SKIP_SAME_CRITERIA') return;
                state.status = 'error';
                state.errorMessage = msg ?? 'Search failed.';
            });
    },
});

export const tourSearchActions = tourSearchSlice.actions;
export const tourSearchReducer = tourSearchSlice.reducer;

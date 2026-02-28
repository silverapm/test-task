import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Price, SearchCriteria, TourSearchState } from './types';

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
        reset(state) {
            state.status = 'idle';
            state.criteria = null;
            state.token = null;
            state.waitUntil = null;
            state.pricesById = {};
            state.priceIds = [];
            state.errorMessage = null;
        },

        start(state, action: PayloadAction<SearchCriteria>) {
            state.status = 'loading';
            state.criteria = action.payload;
            state.errorMessage = null;
            state.token = null;
            state.waitUntil = null;
            state.pricesById = {};
            state.priceIds = [];
        },

        setError(state, action: PayloadAction<string>) {
            state.status = 'error';
            state.errorMessage = action.payload;
        },

        setResults(state, action: PayloadAction<Price[]>) {
            const list = action.payload;

            if (list.length === 0) {
                state.status = 'empty';
                state.pricesById = {};
                state.priceIds = [];
                return;
            }

            state.status = 'success';
            state.pricesById = Object.fromEntries(list.map((p) => [p.id, p]));
            state.priceIds = list.map((p) => p.id);
        },
    },
});

export const tourSearchActions = tourSearchSlice.actions;
export const tourSearchReducer = tourSearchSlice.reducer;

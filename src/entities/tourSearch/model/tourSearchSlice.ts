import { createSlice } from '@reduxjs/toolkit';
import type { TourSearchState } from './types';
import { fetchTourSearch } from './fetchTourSearch';

const initialState: TourSearchState = {
    status: 'idle',
    criteria: null,
    token: null,
    waitUntil: null,
    pricesById: {},
    priceIds: [],
    errorMessage: null,
    activeRequestId: null,
};

export const tourSearchSlice = createSlice({
    name: 'tourSearch',
    initialState,
    reducers: {
        reset() {
            return {...initialState};
        },
        markCancelling(state) {
            if (state.status === 'loading') {
                state.status = 'cancelling';
            }
        }
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
                state.activeRequestId = action.meta.requestId;
            })
            .addCase(fetchTourSearch.fulfilled, (state, action) => {
                if (state.activeRequestId !== action.meta.requestId) return;

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
                if (state.activeRequestId !== action.meta.requestId) return;

                const msg = action.payload;

                if (msg === 'SKIP_SAME_CRITERIA') return;
                state.status = 'error';
                state.errorMessage = msg ?? 'Search failed.';
            });
    },
});

export const tourSearchActions = tourSearchSlice.actions;
export const tourSearchReducer = tourSearchSlice.reducer;

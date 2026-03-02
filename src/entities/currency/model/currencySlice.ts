import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Currency } from '../../../shared/utils/money';

type CurrencyState = {
    selected: Currency;
};

const initialState: CurrencyState = {
    selected: 'usd',
};

export const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency(state, action: PayloadAction<Currency>) {
            state.selected = action.payload;
        },
    },
});

export const currencyActions = currencySlice.actions;
export const currencyReducer = currencySlice.reducer;

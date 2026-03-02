import { configureStore } from '@reduxjs/toolkit';
import { tourSearchReducer } from '../entities/tourSearch/model/tourSearchSlice';
import { hotelReducer } from '../entities/hotel/model/hotelSlice';
import { currencyReducer } from '../entities/currency/model/currencySlice';

export const store = configureStore({
    reducer: {
        tourSearch: tourSearchReducer,
        hotel: hotelReducer,
        currency: currencyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

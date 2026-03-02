import { configureStore } from '@reduxjs/toolkit';
import { tourSearchReducer } from '../entities/tourSearch/model/tourSearchSlice';

export const store = configureStore({
    reducer: {
        tourSearch: tourSearchReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../../shared/api/api.js';
import type { RootState } from '../../../app/store';
import type { Destination } from '../../../features/destinationAutocomplete/types';
import { getCountryId } from '../../../shared/utils/destination';
import { parseJson } from '../../../shared/utils/api';
import { sleepUntil, sleep } from '../../../shared/utils/time';
import type { Price } from './types';

type StartSearchResponse = {
    token: string;
    waitUntil: string;
};

type GetSearchPricesResponse = {
    prices: Record<string, Price>;
};

type ApiError = {
    code?: number;
    error?: boolean;
    message?: string;
    waitUntil?: string;
};

async function readErrorMessage(error: unknown): Promise<{ message: string; waitUntil?: string; status?: number }> {
    if (error instanceof Response) {
        const status = error.status;

        try {
            const body = (await error.json()) as ApiError;
            return {
                status,
                message: body.message ?? `Request failed with status ${status}.`,
                waitUntil: body.waitUntil,
            };
        } catch {
            return { status, message: `Request failed with status ${status}.` };
        }
    }

    if (error instanceof Error) {
        return { message: error.message || 'Unknown error.' };
    }

    return { message: 'Unknown error.' };
}

export const fetchTourSearch = createAsyncThunk<
    { token: string; waitUntil: string; prices: Price[] },
    { destination: Destination },
    { state: RootState; rejectValue: string }
>('tourSearch/fetchTourSearch', async ({ destination }, { getState, rejectWithValue, signal }) => {
    const state = getState().tourSearch;

    if (
        state.status === 'success' &&
        state.criteria?.destination.id === destination.id &&
        state.criteria?.destination.type === destination.type
    ) {
        return rejectWithValue('SKIP_SAME_CRITERIA');
    }

    const countryId = getCountryId(destination);
    if (!countryId) return rejectWithValue('Country id is missing for selected destination.');

    let retriesLeft = 2;

    try {
        const startResp = await api.startSearchPrices(countryId);
        const startBody = await parseJson<StartSearchResponse>(startResp);

        const token = startBody.token;
        let waitUntil = startBody.waitUntil;

        while (true) {
            if (signal.aborted) return rejectWithValue('Search cancelled.');

            await sleepUntil(waitUntil);

            if (signal.aborted) return rejectWithValue('Search cancelled.');

            try {
                const pricesResp = await api.getSearchPrices(token);
                const pricesBody = await parseJson<GetSearchPricesResponse>(pricesResp);

                const prices = Object.values(pricesBody.prices ?? {});
                return { token, waitUntil, prices };
            } catch (err) {
                const info = await readErrorMessage(err);

                if (info.status === 425 && info.waitUntil) {
                    waitUntil = info.waitUntil;
                    continue;
                }

                if (retriesLeft > 0) {
                    retriesLeft -= 1;
                    await sleep(300);
                    continue;
                }

                return rejectWithValue(info.message || 'Failed to fetch search results.');
            }
        }
    } catch (err) {
        const info = await readErrorMessage(err);
        return rejectWithValue(info.message || 'Failed to start search.');
    }
});

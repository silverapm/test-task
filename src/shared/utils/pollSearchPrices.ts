import * as api from '../api/api.js';
import { parseJson } from './api';
import { sleepUntil, sleep } from './time';
import type { Price } from '../../entities/tourSearch/model/types';

type GetSearchPricesResponse = {
    prices: Record<string, Price>;
};

type ApiError = {
    code?: number;
    error?: boolean;
    message?: string;
    waitUntil?: string;
};

async function readError(error: unknown): Promise<{ message: string; waitUntil?: string; status?: number }> {
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

export async function pollSearchPrices(
    token: string,
    initialWaitUntil: string,
    signal: AbortSignal,
    maxRetries = 2
): Promise<Price[]> {
    let waitUntil = initialWaitUntil;
    let retriesLeft = maxRetries;
    let isCompleted = false;

    while (!isCompleted) {
        if (signal.aborted) {
            throw new Error('Search cancelled.');
        }

        await sleepUntil(waitUntil);

        if (signal.aborted) {
            throw new Error('Search cancelled.');
        }

        try {
            const response = await api.getSearchPrices(token);
            const body = await parseJson<GetSearchPricesResponse>(response);

            isCompleted = true;
            return Object.values(body.prices ?? {});
        } catch (error) {
            const info = await readError(error);

            // Not ready yet
            if (info.status === 425 && info.waitUntil) {
                waitUntil = info.waitUntil;
                continue;
            }

            // Retry logic
            if (retriesLeft > 0) {
                retriesLeft -= 1;
                await sleep(300);
                continue;
            }

            throw new Error(info.message || 'Failed to fetch search results.');
        }
    }

    return [];
}

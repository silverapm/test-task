import { useRef, useState } from 'react';
import { DestinationAutocomplete } from '../destinationAutocomplete/DestinationAutocomplete';
import { Button } from '../../shared/ui/Button/Button';
import type { Destination } from '../../entities/destination/model/types';
import { fetchTourSearch } from '../../entities/tourSearch/model/fetchTourSearch';
import { tourSearchActions } from '../../entities/tourSearch/model/tourSearchSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectTourSearch } from '../../entities/tourSearch/model/selectors';
import * as api from '../../shared/api/api.js';
import styles from './TourSearchForm.module.scss';

type AbortableRequest = {
    abort: () => void;
};

export function TourSearchForm() {
    const [destination, setDestination] = useState<Destination | null>(null);

    const dispatch = useAppDispatch();
    const activeRequestRef = useRef<AbortableRequest | null>(null);
    const { token, status } = useAppSelector(selectTourSearch);

    const isBusy = status === 'loading' || status === 'cancelling';
    const canSubmit = Boolean(destination) && !isBusy;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!destination) return;

        activeRequestRef.current?.abort();

        if (activeRequestRef.current || token) {
            dispatch(tourSearchActions.markCancelling());
        }

        if (token) {
            void api.stopSearchPrices(token).catch(() => undefined);
        }

        activeRequestRef.current = dispatch(fetchTourSearch({ destination })) as AbortableRequest;
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
        if (e.key === 'Enter' && canSubmit) {
            e.preventDefault();
            e.currentTarget.requestSubmit();
        }
    }

    return (
        <div className={styles.wrapper}>
            <form
                onSubmit={handleSubmit}
                className={styles.root}
                onKeyDown={handleKeyDown}
            >
                <DestinationAutocomplete
                    value={destination}
                    onChange={setDestination}
                    label="Destination"
                    placeholder="Click or type…"
                />

                <Button type="submit" disabled={!canSubmit}>
                    {status === 'cancelling' ? 'Скасовую…' : status === 'loading' ? 'Шукаю…' : 'Знайти'}
                </Button>
            </form>
        </div>
    );
}

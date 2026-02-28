import { useState } from 'react';
import { DestinationAutocomplete } from '../destinationAutocomplete/DestinationAutocomplete';
import { Button } from '../../shared/ui/Button/Button';
import type { Destination } from '../destinationAutocomplete/types';
import styles from './TourSearchForm.module.scss';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { tourSearchActions } from '../../entities/tourSearch/model/tourSearchSlice';
import { selectTourSearch } from '../../entities/tourSearch/model/selectors';

export function TourSearchForm() {
    const [destination, setDestination] = useState<Destination | null>(null);

    const dispatch = useAppDispatch();
    const { status, errorMessage } = useAppSelector(selectTourSearch);

    const canSubmit = Boolean(destination);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!destination) return;

        dispatch(tourSearchActions.start({ destination }));
    }

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleSubmit} className={styles.root}>
                <DestinationAutocomplete
                    value={destination}
                    onChange={setDestination}
                    label="Destination"
                    placeholder="Click or type…"
                />

                <Button type="submit" disabled={!canSubmit} fullWidth>
                    Знайти
                </Button>
            </form>

            {status === 'loading' ? <div className={styles.loader}>Loading…</div> : null}
            {status === 'error' && errorMessage ? (
                <div className={styles.error}>{errorMessage}</div>
            ) : null}
            {status === 'empty' ? (
                <div className={styles.empty}>За вашим запитом турів не знайдено</div>
            ) : null}
        </div>
    );
}

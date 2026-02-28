import { useState } from 'react';
import { DestinationAutocomplete } from '../destinationAutocomplete/DestinationAutocomplete';
import { Button } from '../../shared/ui/Button/Button';
import type { Destination } from '../destinationAutocomplete/types';
import { TourSearchStatus } from '../../entities/tourSearch/ui/TourSearchStatus.tsx';
import { TourSearchResults } from '../../entities/tourSearch/ui/TourSearchResults.tsx';
import { useAppDispatch } from '../../app/hooks';
import { fetchTourSearch } from '../../entities/tourSearch/model/fetchTourSearch.ts';
import styles from './TourSearchForm.module.scss';

export function TourSearchForm() {
    const [destination, setDestination] = useState<Destination | null>(null);

    const dispatch = useAppDispatch();
    const canSubmit = Boolean(destination);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!destination) return;

        dispatch(fetchTourSearch({ destination }));
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

            <TourSearchStatus />
            <TourSearchResults />
        </div>
    );
}

import { useState } from 'react';
import { DestinationAutocomplete } from '../destinationAutocomplete/DestinationAutocomplete';
import { Button } from '../../shared/ui/Button/Button';
import type { Destination } from '../destinationAutocomplete/types';
import styles from './TourSearchForm.module.scss';

export function TourSearchForm() {
    const [destination, setDestination] = useState<Destination | null>(null);

    const canSubmit = Boolean(destination);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!destination) return;

        console.log('SUBMIT:', destination);
    }

    return (
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
    );
}

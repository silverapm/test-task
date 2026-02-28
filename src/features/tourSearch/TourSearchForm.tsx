import { useState } from 'react';
import { DestinationAutocomplete } from '../destinationAutocomplete/DestinationAutocomplete';
import type { Destination } from '../destinationAutocomplete/types.ts';
import styles from './TourSearchForm.module.scss';

export function TourSearchForm() {
    const [destination, setDestination] = useState<Destination | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('SUBMIT:', destination);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={styles.root}
        >
            <DestinationAutocomplete
                value={destination}
                onChange={setDestination}
                label="Destination"
                placeholder="Click or type…"
            />

            <button type="submit">
                Знайти
            </button>
        </form>
    );
}

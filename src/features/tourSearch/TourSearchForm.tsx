import { useState } from 'react';
import { DestinationAutocomplete } from '../destinationAutocomplete/DestinationAutocomplete';
import type { Destination } from '../destinationAutocomplete/DestinationAutocomplete';

export function TourSearchForm() {
    const [destination, setDestination] = useState<Destination | null>(null);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log('SUBMIT:', destination);
    }

    return (
        <form
            onSubmit={handleSubmit}
            style={{ display: 'grid', gap: 12 }}
        >
            <DestinationAutocomplete
                value={destination}
                onChange={setDestination}
                label="Destination"
                placeholder="Click or type…"
            />

            <button type="submit" style={{ height: 40 }}>
                Знайти
            </button>
        </form>
    );
}

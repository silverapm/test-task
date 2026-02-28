import type { Destination } from '../../features/destinationAutocomplete/types';

export function getCountryId(destination: Destination): string | null {
    if (destination.type === 'country') return String(destination.id);
    return destination.countryId ?? null;
}

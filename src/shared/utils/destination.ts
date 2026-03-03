import type { Destination } from '../../entities/destination/model/types';

export function getCountryId(destination: Destination): string | null {
    if (destination.type === 'country') return String(destination.id);
    return destination.countryId ?? null;
}

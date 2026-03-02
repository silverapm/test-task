import type { SearchCriteria } from '../../entities/tourSearch/model/types';

export function getCountryIdFromCriteria(criteria: SearchCriteria | null): string | null {
    if (!criteria) return null;

    const d = criteria.destination;

    if (d.type === 'country') return String(d.id);

    return d.countryId ?? null;
}

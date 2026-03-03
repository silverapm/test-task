import * as api from '../../../shared/api/api.js';
import type { Destination } from '../model/types';

type CountryDto = { id: string; name: string; flag: string };

export async function getCountries(): Promise<Destination[]> {
    const resp = await api.getCountries();
    const map = (await resp.json()) as Record<string, CountryDto>;

    return Object.values(map).map((c) => ({
        id: c.id,
        type: 'country',
        name: c.name,
        flag: c.flag,
    }));
}

export async function searchDestinations(query: string): Promise<Destination[]> {
    const resp = await api.searchGeo(query);
    const map = (await resp.json()) as Record<string, Destination>;
    return Object.values(map);
}

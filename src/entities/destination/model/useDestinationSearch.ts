import { useCallback, useRef, useState } from 'react';
import type { Destination } from './types';
import { getCountries, searchDestinations } from '../api/destinationApi';

export function useDestinationSearch() {
    const [items, setItems] = useState<Destination[]>([]);

    const countriesCacheRef = useRef<Destination[] | null>(null);
    const searchCacheRef = useRef<Map<string, Destination[]>>(new Map());
    const requestIdRef = useRef(0);

    const loadCountriesCached = useCallback(async () => {
        if (countriesCacheRef.current) {
            setItems(countriesCacheRef.current);
            return;
        }

        const list = await getCountries();
        countriesCacheRef.current = list;
        setItems(list);
    }, []);

    const loadSearchCached = useCallback(
        async (q: string) => {
            const query = q.trim();

            if (!query) {
                await loadCountriesCached();
                return;
            }

            const cached = searchCacheRef.current.get(query);
            if (cached) {
                setItems(cached);
                return;
            }

            const myRequestId = ++requestIdRef.current;

            const list = await searchDestinations(query);

            if (myRequestId !== requestIdRef.current) return;

            searchCacheRef.current.set(query, list);
            setItems(list);
        },
        [loadCountriesCached]
    );

    const clearSuggestions = useCallback(() => {
        setItems([]);
    }, []);

    return {
        items,
        loadCountriesCached,
        loadSearchCached,
        clearSuggestions,
    };
}

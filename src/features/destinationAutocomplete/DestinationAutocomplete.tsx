import { useCallback, useRef, useState } from 'react';
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
} from '@floating-ui/react';

import { useDebouncedCallback } from '../../shared/hooks/useDebouncedCallback';
import { Input } from '../../shared/ui/Input/Input';
import { IconButton } from '../../shared/ui/IconButton/IconButton';
import * as api from '../../shared/api/api.js';
import type { Destination, DestinationAutocompleteProps } from './types';
import styles from './DestinationAutocomplete.module.scss';

function renderIcon(item: Destination) {
    if (item.flag) return <img src={item.flag} alt="" className={styles.flag} />;

    switch (item.type) {
        case 'country':
            return '🌍';
        case 'city':
            return '🏙️';
        case 'hotel':
            return '🏨';
        default:
            return null;
    }
}

export function DestinationAutocomplete({
    value,
    onChange,
    label = 'Destination',
    placeholder = 'Type to search…',
    disabled = false,
}: DestinationAutocompleteProps) {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<Destination[]>([]);
    const [inputValue, setInputValue] = useState(value?.name ?? '');
    const inputElRef = useRef<HTMLInputElement | null>(null);

    const countriesCacheRef = useRef<Destination[] | null>(null);
    const searchCacheRef = useRef<Map<string, Destination[]>>(new Map());
    const requestIdRef = useRef(0);

    const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
        open,
        onOpenChange: setOpen,
        middleware: [offset(6), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
        placement: 'bottom-start',
    });

    const setReference = useCallback(
        (node: HTMLInputElement | null) => {
            inputElRef.current = node;
            refs.setReference(node);
        },
        [refs]
    );

    const setFloating = useCallback(
        (node: HTMLDivElement | null) => {
            refs.setFloating(node);
        },
        [refs]
    );

    const dismiss = useDismiss(context);
    const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

    async function loadCountriesCached() {
        if (countriesCacheRef.current) {
            setItems(countriesCacheRef.current);
            return;
        }

        const resp = await api.getCountries();
        const map = (await resp.json()) as Record<string, { id: string; name: string; flag: string }>;

        const list: Destination[] = Object.values(map).map((c) => ({
            id: c.id,
            type: 'country',
            name: c.name,
            flag: c.flag,
        }));

        countriesCacheRef.current = list;
        setItems(list);
    }

    async function loadSearchCached(q: string) {
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

        const resp = await api.searchGeo(query);
        const map = (await resp.json()) as Record<string, Destination>;
        const list = Object.values(map);

        if (myRequestId !== requestIdRef.current) return;

        searchCacheRef.current.set(query, list);
        setItems(list);
    }

    const { debounced: debouncedSearch, cancel: cancelDebounce } = useDebouncedCallback(
        (q: string) => {
            void loadSearchCached(q);
        },
        300
    );

    async function handleOpen() {
        if (disabled) return;

        setOpen(true);
        cancelDebounce();

        if (value?.type === 'country' || !value) {
            await loadCountriesCached();
            return;
        }

        await loadSearchCached(inputValue);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.value;
        setInputValue(next);

        if (value && next !== value.name) onChange(null);

        setOpen(true);
        debouncedSearch(next);
    }

    function handleDropdownMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function selectItem(item: Destination) {
        cancelDebounce();

        onChange(item);
        setInputValue(item.name);
        setOpen(false);

        inputElRef.current?.blur();
    }

    function handleItemClick(e: React.MouseEvent<HTMLDivElement>) {
        const idxStr = e.currentTarget.dataset.index;
        const idx = idxStr ? Number(idxStr) : NaN;
        if (!Number.isFinite(idx)) return;

        const item = items[idx];
        if (!item) return;

        selectItem(item);
    }

    function handleClear() {
        cancelDebounce();

        onChange(null);
        setInputValue('');
        setItems([]);
        setOpen(false);
    }

    return (
        <div className={styles.root}>
            <Input
                label={label}
                placeholder={placeholder}
                disabled={disabled}
                value={inputValue}
                onChange={handleInputChange}
                onFocus={handleOpen}
                inputRef={setReference}
                {...getReferenceProps()}
            />

            {value && !disabled && (
                <IconButton
                    aria-label="Clear selection"
                    size="sm"
                    className={styles.clearButton}
                    onClick={handleClear}
                >
                    ✕
                </IconButton>
            )}

            {open ? (
                <div
                    ref={setFloating}
                    className={styles.dropdown}
                    style={floatingStyles}
                    {...getFloatingProps({
                        onMouseDown: handleDropdownMouseDown,
                    })}
                >
                    {items.length === 0 ? (
                        <div className={styles.empty}>No results</div>
                    ) : (
                        <div className={styles.list}>
                            {items.map((it, index) => (
                                <div
                                    key={`${it.type}-${String(it.id)}`}
                                    data-index={index}
                                    onClick={handleItemClick}
                                    className={styles.item}
                                >
                                    <span className={styles.icon}>{renderIcon(it)}</span>

                                    <span className={styles.name}>{it.name}</span>

                                    <span className={styles.type}>{it.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}

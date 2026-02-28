import { useCallback, useState } from 'react';
import {
    autoUpdate,
    flip,
    offset,
    shift,
    useDismiss,
    useFloating,
    useInteractions,
} from '@floating-ui/react';

import { Input } from '../../shared/ui/Input/Input';
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

    const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
        open,
        onOpenChange: setOpen,
        middleware: [offset(6), flip(), shift({ padding: 8 })],
        whileElementsMounted: autoUpdate,
        placement: 'bottom-start',
    });

    const setReference = useCallback(
        (node: HTMLInputElement | null) => {
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

    async function loadCountries() {
        const resp = await api.getCountries();
        const map = (await resp.json()) as Record<string, { id: string; name: string; flag: string }>;

        setItems(
            Object.values(map).map((c) => ({
                id: c.id,
                type: 'country',
                name: c.name,
                flag: c.flag,
            }))
        );
    }

    async function loadSearch(q: string) {
        const resp = await api.searchGeo(q);
        const map = (await resp.json()) as Record<string, Destination>;
        setItems(Object.values(map));
    }

    async function handleOpen() {
        if (disabled) return;

        setOpen(true);

        if (value?.type === 'country' || !value) {
            await loadCountries();
            return;
        }

        await loadSearch(inputValue);
    }

    async function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const next = e.target.value;
        setInputValue(next);

        if (value && next !== value.name) onChange(null);

        setOpen(true);
        await loadSearch(next);
    }

    function handleDropdownMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function selectItem(item: Destination) {
        onChange(item);
        setInputValue(item.name);
        setOpen(false);
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
                <button type="button" className={styles.clearButton} onClick={handleClear}>
                    ✕
                </button>
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

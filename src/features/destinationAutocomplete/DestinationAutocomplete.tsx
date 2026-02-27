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
import styles from './DestinationAutocomplete.module.scss';

export type DestinationType = 'country' | 'city' | 'hotel';

export type Destination = {
    id: string | number;
    type: DestinationType;
    name: string;
    flag?: string;
    countryId?: string;
    cityId?: number;
    countryName?: string;
    cityName?: string;
    img?: string;
};

export type DestinationAutocompleteProps = {
    value: Destination | null;
    onChange: (next: Destination | null) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
};

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

    async function handleChange(next: string) {
        setInputValue(next);

        if (value && next !== value.name) onChange(null);

        setOpen(true);
        await loadSearch(next);
    }

    function selectItem(item: Destination) {
        onChange(item);
        setInputValue(item.name);
        setOpen(false);
    }

    function renderIcon(item: Destination) {
        if (item.flag) {
            return <img src={item.flag} alt="" className={styles.flag} />;
        }

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

    function clearSelection() {
        onChange(null);
        setInputValue('');
        setItems([]);
        setOpen(false);
    }

    return (
        <div className={styles.root}>
            <div className={styles.field}>
                <Input
                    label={label}
                    placeholder={placeholder}
                    disabled={disabled}
                    value={inputValue}
                    onChange={(e) => void handleChange(e.target.value)}
                    onFocus={() => void handleOpen()}
                    inputRef={setReference}
                    {...getReferenceProps()}
                    className={styles.inputWithClear}
                />

                {value && !disabled && (
                    <button type="button" className={styles.clearButton} onClick={clearSelection}>
                        ✕
                    </button>
                )}
            </div>

            {open ? (
                <div
                    ref={setFloating}
                    className={styles.dropdown}
                    style={floatingStyles}
                    {...getFloatingProps({
                        onMouseDown: (e) => e.preventDefault(),
                    })}
                >
                    {items.length === 0 ? (
                        <div className={styles.empty}>No results</div>
                    ) : (
                        <div className={styles.list}>
                            {items.map((it) => (
                                <div
                                    key={`${it.type}-${String(it.id)}`}
                                    onClick={() => selectItem(it)}
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

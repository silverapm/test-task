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
import { useDestinationSearch } from '../../entities/destination/model/useDestinationSearch';
import { FloatingDropdown } from '../../shared/ui/FloatingDropdown/FloatingDropdown';
import type { Destination } from '../../entities/destination/model/types';
import styles from './DestinationAutocomplete.module.scss';

type DestinationAutocompleteProps = {
    value: Destination | null;
    onChange: (next: Destination | null) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
};

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
    const [inputValue, setInputValue] = useState(value?.name ?? '');
    const inputElRef = useRef<HTMLInputElement | null>(null);

    const { items, loadCountriesCached, loadSearchCached, clearSuggestions } = useDestinationSearch();

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
        clearSuggestions();
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

            <FloatingDropdown
                open={open}
                setFloating={setFloating}
                floatingStyles={floatingStyles}
                getFloatingProps={getFloatingProps}
                onMouseDown={handleDropdownMouseDown}
                className={styles.dropdown}
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
            </FloatingDropdown>
        </div>
    );
}

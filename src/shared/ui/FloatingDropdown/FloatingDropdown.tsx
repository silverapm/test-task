import type { CSSProperties, ReactNode } from 'react';
import styles from './FloatingDropdown.module.scss';

type FloatingDropdownProps = {
    open: boolean;
    floatingStyles: CSSProperties;
    setFloating: (node: HTMLDivElement | null) => void;
    getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => Record<string, unknown>;
    onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
    children: ReactNode;
    className?: string;
};

export function FloatingDropdown({
    open,
    floatingStyles,
    setFloating,
    getFloatingProps,
    onMouseDown,
    children,
    className,
}: FloatingDropdownProps) {
    if (!open) return null;

    return (
        <div
            ref={setFloating}
            className={className ?? styles.dropdown}
            style={floatingStyles}
            {...getFloatingProps({ onMouseDown })}
        >
            {children}
        </div>
    );
}

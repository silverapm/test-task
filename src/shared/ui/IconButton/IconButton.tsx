import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './IconButton.module.scss';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type IconButtonProps = NativeProps & {
    children: ReactNode;
    size?: 'sm' | 'md';
    variant?: 'ghost';
};

export function IconButton({
    children,
    size = 'md',
    variant = 'ghost',
    className,
    disabled,
    ...rest
}: IconButtonProps) {
    return (
        <button
            type="button"
            className={clsx(
                styles.root,
                styles[size],
                styles[variant],
                className
            )}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}
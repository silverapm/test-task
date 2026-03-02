import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.scss';

type NativeProps = ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonProps = NativeProps & {
    children: ReactNode;
    variant?: 'primary';
    fullWidth?: boolean;
};

export function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className,
    disabled,
    ...rest
}: ButtonProps) {
    return (
        <button
            className={clsx(
                styles.root,
                styles[variant],
                fullWidth && styles.fullWidth,
                className
            )}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}

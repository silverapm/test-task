import { useId } from 'react';
import styles from './Input.module.scss';

type NativeProps = React.ComponentPropsWithoutRef<'input'>;

export type InputProps = NativeProps & {
    inputRef?: React.Ref<HTMLInputElement>;
    label?: string;
    error?: string;
    fullWidth?: boolean;
};

export function Input({
    inputRef,
    label,
    error,
    id,
    className,
    fullWidth = true,
    ...inputProps
}: InputProps) {
    const autoId = useId();
    const inputId = id ?? `input-${autoId}`;

    return (
        <div
            className={[
                styles.root,
                fullWidth ? styles.fullWidth : '',
                className ?? '',
            ].join(' ')}
        >
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}

            <input {...inputProps} id={inputId} ref={inputRef} className={styles.input} />

            {error ? <div className={styles.error}>{error}</div> : null}
        </div>
    );
}

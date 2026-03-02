import clsx from 'clsx';
import styles from './Loader.module.scss';

export type LoaderProps = {
    label?: string;
    className?: string;
};

export function Loader({ label = 'Loading…', className }: LoaderProps) {
    return (
        <div className={clsx(styles.root, className)} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden="true" />
            <span className={styles.label}>{label}</span>
        </div>
    );
}

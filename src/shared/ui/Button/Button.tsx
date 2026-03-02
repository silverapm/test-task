import clsx from 'clsx';
import styles from './Button.module.scss';

type NativeButtonProps = React.ComponentPropsWithoutRef<'button'>;

export type ButtonVariant = 'primary' | 'secondary' | 'link';

export type ButtonProps = NativeButtonProps & {
    variant?: ButtonVariant;
    fullWidth?: boolean;
};

export function Button({
    variant = 'primary',
    fullWidth,
    className,
    type = 'button',
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            className={clsx(
                styles.root,
                styles[variant],
                fullWidth && styles.fullWidth,
                className
            )}
            {...rest}
        />
    );
}

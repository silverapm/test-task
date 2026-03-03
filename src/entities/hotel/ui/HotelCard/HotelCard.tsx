import { Button } from '../../../../shared/ui/Button/Button';
import { HOTEL_SERVICE_ICONS, HOTEL_SERVICE_LABELS } from '../../../../shared/utils/hotelServices';
import styles from './HotelCard.module.scss';

type HotelServices = Record<string, string>;

type HotelCardProps = {
    title: string;
    location: string;

    imageUrl?: string | null;

    // hotel details (optional)
    description?: string;
    services?: HotelServices;

    // tour / price details (optional)
    startDate?: string;
    endDate?: string;
    priceLabel?: string;

    // optional action
    actionText?: string;
    onAction?: () => void;
};

function isYes(value: unknown) {
    return String(value).toLowerCase() === 'yes';
}

export function HotelCard({
    title,
    location,
    imageUrl,
    description,
    services,
    startDate,
    endDate,
    priceLabel,
    actionText,
    onAction,
}: HotelCardProps) {
    const hasDates = Boolean(startDate && endDate);
    const hasPrice = Boolean(priceLabel);
    const hasMeta = hasDates || hasPrice;

    const hasAction = Boolean(actionText && onAction);

    const servicesYes = services
        ? Object.entries(services).filter(([, v]) => isYes(v))
        : [];

    const hasServices = servicesYes.length > 0;

    return (
        <article className={styles.card}>
            {imageUrl ? (
                <img src={imageUrl} alt="" className={styles.image} />
            ) : (
                <div className={styles.imagePlaceholder} />
            )}

            <div className={styles.body}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.location}>{location}</div>

                {description ? <p className={styles.description}>{description}</p> : null}

                {hasServices ? (
                    <div className={styles.services}>
                        {servicesYes.map(([key]) => (
                            <span key={key}>
                                <span className={styles.serviceIcon} aria-hidden="true">
                                    {HOTEL_SERVICE_ICONS[key as keyof typeof HOTEL_SERVICE_ICONS] ?? '•'}
                                </span>

                                {HOTEL_SERVICE_LABELS[key as keyof typeof HOTEL_SERVICE_LABELS] ?? key}
                            </span>
                        ))}
                    </div>
                ) : null}

                {hasMeta ? (
                    <dl className={styles.meta}>
                        {hasDates ? (
                            <div className={styles.metaRow}>
                                <dt className={styles.metaLabel}>Dates</dt>
                                <dd className={styles.metaValue}>
                                    {startDate} → {endDate}
                                </dd>
                            </div>
                        ) : null}

                        {hasPrice ? (
                            <div className={styles.metaRow}>
                                <dt className={styles.metaLabel}>Price</dt>
                                <dd className={styles.metaValue}>{priceLabel}</dd>
                            </div>
                        ) : null}
                    </dl>
                ) : null}

                {hasAction ? (
                    <Button
                        type="button"
                        variant="link"
                        onClick={onAction}
                        className={styles.action}
                    >
                        {actionText}
                    </Button>
                ) : null}
            </div>
        </article>
    );
}

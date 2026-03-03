import { Button } from '../../shared/ui/Button/Button.tsx';
import { HOTEL_SERVICE_ICONS, HOTEL_SERVICE_LABELS, isYesService } from '../../shared/utils/hotelServices.ts';
import styles from './HotelCard.module.scss';

type HotelServices = Record<string, string>;

type HotelCardProps = {
    title: string;
    location: string;
    imageUrl?: string | null;
    description?: string;
    services?: HotelServices;
    startDate?: string;
    endDate?: string;
    priceLabel?: string;
    actionText?: string;
    onAction?: () => void;
    isCompact?: boolean;
};

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
    isCompact = false,
}: HotelCardProps) {
    const hasDates = Boolean(startDate && endDate);
    const hasPrice = Boolean(priceLabel);
    const hasAction = Boolean(actionText && onAction);

    const servicesYes = services ? Object.entries(services).filter(([, v]) => isYesService(v)) : [];
    const hasServices = servicesYes.length > 0;

    return (
        <article className={styles.card}>
            {!isCompact ? (
                <>
                    <h3 className={styles.title}>{title}</h3>

                    <div className={styles.location}>{location}</div>
                </>
            ) : null}

            {imageUrl ? (
                <img src={imageUrl} alt="" className={styles.image} />
            ) : (
                <div className={styles.imagePlaceholder} />
            )}

            {isCompact ? (
                <>
                    <h3 className={styles.compactTitle}>{title}</h3>

                    <div className={styles.location}>{location}</div>
                </>
            ) : null}

            {!isCompact && description ? (
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Опис</h4>

                    <p className={styles.description}>{description}</p>
                </section>
            ) : null}

            {!isCompact && hasServices ? (
                <section className={styles.section}>
                    <h4 className={styles.sectionTitle}>Сервіси</h4>

                    <div className={styles.services}>
                        {servicesYes.map(([key]) => (
                            <span key={key} className={styles.serviceTag}>

                            <span className={styles.serviceIcon} aria-hidden="true">
                              {HOTEL_SERVICE_ICONS[key as keyof typeof HOTEL_SERVICE_ICONS] ?? '•'}
                            </span>

                            <span className={styles.serviceText}>
                              {HOTEL_SERVICE_LABELS[key as keyof typeof HOTEL_SERVICE_LABELS] ?? key}
                            </span>
                          </span>
                        ))}
                    </div>
                </section>
            ) : null}

            {hasDates ? (
                <section className={styles.section}>
                    {!isCompact && <h4 className={styles.sectionTitle}>Дати</h4>}

                    <dl className={styles.meta}>
                        <dd className={styles.datesValue}>
                            {startDate} → {endDate}
                        </dd>
                    </dl>
                </section>
            ) : null}

            {hasPrice ? (
                <section className={styles.section}>
                    {!isCompact && <h4 className={styles.sectionTitle}>Ціна</h4>}

                    <dl className={styles.meta}>
                        <dd className={styles.priceValue}>{priceLabel}</dd>
                    </dl>
                </section>
            ) : null}

            {hasAction ? (
                <Button type="button" variant="link" onClick={onAction} className={styles.action}>
                    {actionText}
                </Button>
            ) : null}
        </article>
    );
}

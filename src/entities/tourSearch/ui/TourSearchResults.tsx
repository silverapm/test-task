import { useAppSelector } from '../../../app/hooks';
import { Loader } from '../../../shared/ui/Loader/Loader';
import { Button } from '../../../shared/ui/Button/Button';
import { selectTourSearch, selectTourCards } from '../model/selectors';
import { selectCurrency } from '../../currency/model/selectors';
import { convertMoney, formatMoney } from '../../../shared/utils/money';
import { formatDateDdMmYyyy } from '../../../shared/utils/date';
import { getCountryIdFromCriteria } from '../../../shared/utils/searchCriteria';
import styles from './TourSearchResults.module.scss';

export function TourSearchResults() {
    const search = useAppSelector(selectTourSearch);
    const cards = useAppSelector(selectTourCards);
    const currency = useAppSelector(selectCurrency);
    const countryId = getCountryIdFromCriteria(search.criteria);

    const hotelsForCountry = useAppSelector((s) =>
        countryId ? s.hotel.hotelsByCountryId[countryId] : undefined
    );

    const hotelsLoading = useAppSelector((s) =>
        countryId ? Boolean(s.hotel.loadingByCountryId[countryId]) : false
    );

    if (search.status === 'loading') {
        return (
            <div className={styles.root}>
                <div className={styles.loader}>
                    <Loader label="Searching tours…" />
                </div>
            </div>
        );
    }

    if (search.status === 'empty') {
        return (
            <div className={styles.root}>
                <div className={styles.empty}>За вашим запитом турів не знайдено</div>
            </div>
        );
    }

    if (search.status === 'error') {
        return (
            <div className={styles.root}>
                <div className={styles.empty}>{search.errorMessage ?? 'Something went wrong'}</div>
            </div>
        );
    }

    if (search.status !== 'success') return null;

    if (countryId && hotelsLoading && !hotelsForCountry) {
        return (
            <div className={styles.root}>
                <div className={styles.loader}>
                    <Loader label="Loading hotels…" />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.root}>
            <div className={styles.grid}>
                {cards.map((card) => {
                    const converted = convertMoney(card.amount, 'usd', currency);

                    return (
                        <article key={card.priceId} className={styles.card}>
                            {card.imageUrl ? (
                                <img className={styles.image} src={card.imageUrl} alt="" />
                            ) : (
                                <div className={styles.imagePlaceholder} />
                            )}

                            <div className={styles.body}>
                                <h3 className={styles.title}>{card.title}</h3>

                                <div className={styles.location}>{card.location}</div>

                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}>Dates</span>

                                    <span className={styles.metaValue}>
                                        {formatDateDdMmYyyy(card.startDate)} → {formatDateDdMmYyyy(card.endDate)}
                                    </span>
                                </div>

                                <div className={styles.metaRow}>
                                    <span className={styles.metaLabel}>Price</span>

                                    <span className={styles.metaValue}>{formatMoney(converted, currency)}</span>
                                </div>

                                <Button type="button" variant="link" className={styles.openPriceButton}>
                                    Відкрити ціну
                                </Button>
                            </div>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

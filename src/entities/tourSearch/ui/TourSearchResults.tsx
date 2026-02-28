import { useAppSelector } from '../../../app/hooks';
import { selectTourSearch } from '../model/selectors';
import styles from './TourSearchResults.module.scss';

export function TourSearchResults() {
    const { status, priceIds, pricesById } = useAppSelector(selectTourSearch);

    if (status !== 'success') return null;

    return (
        <div className={styles.root}>
            <h2 className={styles.title}>Results</h2>

            <div className={styles.list}>
                {priceIds.map((id) => {
                    const p = pricesById[id];
                    if (!p) return null;

                    return (
                        <div key={id} className={styles.card}>
                            <div className={styles.row}>
                                <span className={styles.label}>Hotel ID</span>
                                <span className={styles.value}>{p.hotelID}</span>
                            </div>

                            <div className={styles.row}>
                                <span className={styles.label}>Dates</span>

                                <span className={styles.value}>
                                  {p.startDate} → {p.endDate}
                                </span>
                            </div>

                            <div className={styles.row}>
                                <span className={styles.label}>Price</span>

                                <span className={styles.value}>
                                  {p.amount} {p.currency.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks.ts';
import { Loader } from '../../shared/ui/Loader/Loader.tsx';
import { selectTourSearch, selectTourCards } from '../../entities/tourSearch/model/selectors.ts';
import { selectCurrency } from '../../entities/currency/model/selectors.ts';
import { convertMoney, formatMoney } from '../../shared/utils/money.ts';
import { formatDateDdMmYyyy } from '../../shared/utils/date.ts';
import { getCountryIdFromCriteria } from '../../shared/utils/searchCriteria.ts';
import { HotelCard } from '../HotelCard/HotelCard.tsx';
import styles from './TourSearchResults.module.scss';

export function TourSearchResults() {
    const search = useAppSelector(selectTourSearch);
    const cards = useAppSelector(selectTourCards);
    const currency = useAppSelector(selectCurrency);
    const countryId = getCountryIdFromCriteria(search.criteria);
    const navigate = useNavigate();

    function handleOpenPrice(priceId: string | number, hotelId: string | number) {
        navigate(`/tour/${priceId}?hotelId=${hotelId}`);
    }

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
                    return (
                        <HotelCard
                            key={card.priceId}
                            title={card.title}
                            location={card.location}
                            imageUrl={card.imageUrl}
                            startDate={`${formatDateDdMmYyyy(card.startDate)}`}
                            endDate={`${formatDateDdMmYyyy(card.endDate)}`}
                            priceLabel={formatMoney(convertMoney(card.amount, 'usd', currency), currency)}
                            actionText="Відкрити ціну"
                            onAction={() => handleOpenPrice(card.priceId, card.hotelId)}
                            isCompact
                        />
                    );
                })}
            </div>
        </div>
    );
}

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Loader } from '../../shared/ui/Loader/Loader';
import { Button } from '../../shared/ui/Button/Button';
import { useAppSelector } from '../../app/hooks';
import { selectCurrency } from '../../entities/currency/model/selectors';
import { convertMoney, formatMoney } from '../../shared/utils/money';
import { formatDateDdMmYyyy } from '../../shared/utils/date';
import { HotelCard } from '../hotelCard/HotelCard';
import { useTourDetails } from '../../entities/tourDetails/model/useTourDetails';
import styles from './TourDetails.module.scss';

export function TourDetails() {
    const { priceId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const hotelIdParam = searchParams.get('hotelId');
    const hotelId = hotelIdParam ? Number(hotelIdParam) : null;

    const currency = useAppSelector(selectCurrency);
    const { state, retry } = useTourDetails(priceId, hotelId);

    function handleBack() {
        navigate(-1);
    }

    if (state.status === 'loading') {
        return (
            <div className={styles.root}>
                <div className={styles.loader}>
                    <Loader label="Loading tour…" />
                </div>
            </div>
        );
    }

    if (state.status === 'error') {
        return (
            <div className={styles.root}>
                <div className={styles.error}>
                    <div className={styles.errorTitle}>Something went wrong</div>

                    <div className={styles.errorText}>{state.message}</div>

                    <Button type="button" onClick={retry}>Retry</Button>
                </div>
            </div>
        );
    }

    const { price, hotel } = state;
    const location = `${hotel.countryName ?? ''}${hotel.cityName ? `, ${hotel.cityName}` : ''}`;

    return (
        <div className={styles.root}>
            <Button type="button" variant="link" className={styles.backButton} onClick={handleBack}>
                ← Back to search
            </Button>

            <div className={styles.cardWrapper}>
                <HotelCard
                    title={hotel.name}
                    location={location}
                    imageUrl={hotel.img ?? null}
                    description={hotel.description}
                    services={hotel.services}
                    startDate={formatDateDdMmYyyy(price.startDate)}
                    endDate={formatDateDdMmYyyy(price.endDate)}
                    priceLabel={formatMoney(convertMoney(price.amount, 'usd', currency), currency)}
                />
            </div>
        </div>
    );
}

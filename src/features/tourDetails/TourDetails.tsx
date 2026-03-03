import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import * as api from '../../shared/api/api.js';
import { parseJson } from '../../shared/utils/api';
import { Loader } from '../../shared/ui/Loader/Loader';
import { Button } from '../../shared/ui/Button/Button';
import { useAppSelector } from '../../app/hooks';
import { selectCurrency } from '../../entities/currency/model/selectors';
import { convertMoney, formatMoney } from '../../shared/utils/money';
import { formatDateDdMmYyyy } from '../../shared/utils/date';
import { HotelCard } from '../HotelCard/HotelCard';
import styles from './TourDetails.module.scss';

type PriceDetails = {
    id: string;
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
};

type HotelDetails = {
    id: number;
    name: string;
    img?: string;
    countryName?: string;
    cityName?: string;
    description?: string;
    services?: Record<string, string>;
};

export function TourDetails() {
    const { priceId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const hotelIdParam = searchParams.get('hotelId');
    const hotelId = hotelIdParam ? Number(hotelIdParam) : null;

    const currency = useAppSelector(selectCurrency);

    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [price, setPrice] = useState<PriceDetails | null>(null);
    const [hotel, setHotel] = useState<HotelDetails | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function loadTour() {
            if (!priceId) {
                setStatus('error');
                setErrorMessage('Missing priceId in URL.');
                return;
            }

            if (!hotelId || Number.isNaN(hotelId)) {
                setStatus('error');
                setErrorMessage('Missing hotelId in URL.');
                return;
            }

            setStatus('loading');
            setErrorMessage(null);
            setPrice(null);
            setHotel(null);

            try {
                const [priceResp, hotelResp] = await Promise.all([
                    api.getPrice(priceId),
                    api.getHotel(hotelId),
                ]);

                const priceBody = await parseJson<PriceDetails>(priceResp);
                const hotelBody = await parseJson<HotelDetails>(hotelResp);

                if (cancelled) return;

                setPrice(priceBody);
                setHotel(hotelBody);
                setStatus('success');
            } catch (err) {
                if (cancelled) return;

                const message = err instanceof Error ? err.message : 'Failed to load tour details.';
                setStatus('error');
                setErrorMessage(message);
            }
        }

        void loadTour();

        return () => {
            cancelled = true;
        };
    }, [priceId, hotelId]);

    function handleRetry() {
        window.location.reload();
    }

    function handleBack() {
        navigate(-1);
    }

    if (status === 'loading') {
        return (
            <div className={styles.root}>
                <div className={styles.loader}>
                    <Loader label="Loading tour…" />
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.root}>
                <div className={styles.error}>
                    <div className={styles.errorTitle}>Something went wrong</div>
                    <div className={styles.errorText}>{errorMessage ?? 'Unknown error.'}</div>

                    <Button type="button" onClick={handleRetry}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    if (!price || !hotel) return null;

    const location = `${hotel.countryName ?? ''}${hotel.cityName ? `, ${hotel.cityName}` : ''}`;

    return (
        <div className={styles.root}>
            <Button
                type="button"
                variant="link"
                className={styles.backButton}
                onClick={handleBack}
            >
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

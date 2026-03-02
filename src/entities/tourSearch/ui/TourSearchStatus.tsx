import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../app/hooks';
import { selectTourSearch } from '../model/selectors';
import styles from './TourSearchStatus.module.scss';

function formatTimeLeft(ms: number) {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return min > 0 ? `${min}m ${sec}s` : `${sec}s`;
}

export function TourSearchStatus() {
    const { status, waitUntil, errorMessage, priceIds } = useAppSelector(selectTourSearch);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (status !== 'loading') return;
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, [status]);

    const msLeft = useMemo(() => {
        if (!waitUntil) return null;
        return Math.max(0, new Date(waitUntil).getTime() - now);
    }, [waitUntil, now]);

    if (status === 'loading') {
        return (
            <div className={styles.panel}>
                <div className={styles.title}>Searching tours…</div>

                {waitUntil && msLeft !== null ? (
                    <div className={styles.meta}>
                        Next request window in <strong>{formatTimeLeft(msLeft)}</strong>
                    </div>
                ) : (
                    <div className={styles.meta}>Preparing request…</div>
                )}
            </div>
        );
    }

    if (status === 'error' && errorMessage) {
        return <div className={styles.error}>{errorMessage}</div>;
    }

    if (status === 'empty') {
        return <div className={styles.empty}>За вашим запитом турів не знайдено</div>;
    }

    if (status === 'success') {
        return <div className={styles.success}>Found: {priceIds.length}</div>;
    }

    return null;
}

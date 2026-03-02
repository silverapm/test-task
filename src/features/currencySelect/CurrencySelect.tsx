import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { currencyActions } from '../../entities/currency/model/currencySlice';
import { selectCurrency } from '../../entities/currency/model/selectors';
import type { Currency } from '../../shared/utils/money';
import styles from './CurrencySelect.module.scss';

export function CurrencySelect() {
    const dispatch = useAppDispatch();
    const value = useAppSelector(selectCurrency);

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        dispatch(currencyActions.setCurrency(e.target.value as Currency));
    }

    return (
        <div className={styles.root}>
            <span className={styles.label}>Currency</span>

            <select
                value={value}
                onChange={handleChange}
                className={styles.select}
            >
                <option value="usd">USD</option>
                <option value="uah">UAH</option>
            </select>
        </div>
    );
}

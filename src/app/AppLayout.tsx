import { Outlet } from 'react-router-dom';
import { CurrencySelect } from '../features/currencySelect/CurrencySelect';
import styles from './App.module.scss';

export function AppLayout() {
    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <h1 className={styles.heroHeading}>Tour search</h1>
                <CurrencySelect />
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

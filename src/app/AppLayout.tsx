import { Outlet } from 'react-router-dom';
import { CurrencySelect } from '../features/currencySelect/CurrencySelect';
import styles from './App.module.scss';

export function AppLayout() {
    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <div>
                    <h1>Tour search</h1>
                    <CurrencySelect />
                </div>
            </header>

            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}

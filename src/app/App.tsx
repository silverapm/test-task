import { TourSearchForm } from '../features/tourSearch/TourSearchForm.tsx';
import { TourSearchResults } from '../entities/tourSearch/ui/TourSearchResults.tsx';
import { CurrencySelect } from '../features/currencySelect/CurrencySelect.tsx';

import styles from './App.module.scss';

function App() {
    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <div>
                    <h1>Tour search</h1>

                    <CurrencySelect />
                </div>
            </header>

            <main className={styles.main}>
                <TourSearchForm />
                <TourSearchResults />
            </main>
        </div>
    );
}

export default App;

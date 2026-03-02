import { TourSearchForm } from './features/tourSearch/TourSearchForm';

function App() {
    return (
        <div style={{ maxWidth: 520, margin: '40px auto', padding: 16 }}>
            <h1 style={{ marginBottom: 16 }}>Tour search</h1>

            <TourSearchForm />
        </div>
    );
}

export default App;

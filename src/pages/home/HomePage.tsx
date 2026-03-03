import { TourSearchForm } from '../../features/tourSearch/TourSearchForm';
import { TourSearchResults } from '../../features/tourSearchResults/TourSearchResults';

export function HomePage() {
    return (
        <>
            <TourSearchForm />
            <TourSearchResults />
        </>
    );
}

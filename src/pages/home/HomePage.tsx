import { TourSearchForm } from '../../features/tourSearch/TourSearchForm';
import { TourSearchResults } from '../../entities/tourSearch/ui/TourSearchResults';

export function HomePage() {
    return (
        <>
            <TourSearchForm />
            <TourSearchResults />
        </>
    );
}

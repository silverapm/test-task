import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomePage } from '../pages/home/HomePage';
import { TourPage } from '../pages/tour/TourPage';

const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/tour/:priceId', element: <TourPage /> },
        ],
    },
]);

export function AppRouter() {
    return <RouterProvider router={router} />;
}

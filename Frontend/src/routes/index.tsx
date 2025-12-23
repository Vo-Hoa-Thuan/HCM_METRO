import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';
import Map from '@/pages/Map';
import Search from '@/pages/Search';
import RoutesPage from '@/pages/Routes';
import Tickets from '@/pages/Tickets';
import Support from '@/pages/Support';
import Schedule from '@/pages/Schedule';
import Devices from '@/pages/Devices';
import RealTime from '@/pages/RealTime';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import Payment from '@/pages/Payment';
import Progress from '@/pages/Progress';
import News from '@/pages/News';
import PaymentSuccessPage from '@/pages/VN_Pay_payment/payment-success';
import PaymentFailPage from '@/pages/VN_Pay_payment/payment-fail';
import TicketHistory from '@/pages/TicketHistory';
import RouteExplorer from '@/pages/RouteExplorer';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />
    },
    {
        path: '/map',
        element: <Map />
    },
    {
        path: '/search',
        element: <Search />
    },
    {
        path: '/routes',
        element: <RoutesPage />
    },
    {
        path: '/route-explorer',
        element: <RouteExplorer />
    },
    {
        path: '/tickets',
        element: <Tickets />
    },
    {
        path: '/ticket-history',
        element: <ProtectedRoute><TicketHistory /></ProtectedRoute>
    },
    {
        path: '/support',
        element: <Support />
    },
    {
        path: '/schedule',
        element: <Schedule />
    },
    {
        path: '/devices',
        element: <Devices />
    },
    {
        path: '/realtime',
        element: <RealTime />
    },
    {
        path: '/progress',
        element: <Progress />
    },
    {
        path: '/news',
        element: <News />
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/admin',
        element: <ProtectedRoute><Admin /></ProtectedRoute>
    },
    {
        path: '/payment',
        element: <Payment />
    },
    {
        path: '/payment/success',
        element: <PaymentSuccessPage />
    },
    {
        path: '/payment/fail',
        element: <PaymentFailPage />
    },
    {
        path: '/404',
        element: <NotFound />
    },
    {
        path: '*',
        element: <Navigate to="/404" replace />
    }
]);

export default router; 
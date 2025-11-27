import { createBrowserRouter } from 'react-router-dom';
import NotFound from '../pages/errors/NotFound';
import AuthLayout from '../layout/AuthLayout';
import RootLayout from '../layout/RootLayout';
import Dashboard from '../pages/app/Dashboard';
import ProductStock from '../pages/app/ProductStock';
import SignUp from '../pages/auth/SignUp';
import SalesProductPage from '../pages/app/salesProduct';
import Favorites from '../pages/app/Favorites';
import Inbox from '../pages/app/Inbox';
import OrderLists from '../pages/app/OrderLists';
import Pricing from '../pages/app/Pricing';
import Calendar from '../pages/app/Calendar';
import Todo from '../pages/app/Todo';
import Contact from '../pages/app/Contact';
import Invoice from '../pages/app/Invoice';
import UIElements from '../pages/app/UIElements';
import Team from '../pages/app/Team';
import Table from '../pages/app/Table';

export const router = createBrowserRouter([
    // 1) Auth 영역 (/auth/signup) – 비보호
    {
        path: '/auth',
        element: <AuthLayout />, // Auth 전용 레이아웃
        children: [
            { path: 'signup', element: <SignUp /> },
        ],
        errorElement: <NotFound />,
    },

    // 2) App 영역 – 전체 보호
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <NotFound />,
        children: [
            { index: true, element: <Dashboard /> },
            { path: 'product-stock', element: <ProductStock /> },
            { path: 'sales-product', element: <SalesProductPage /> },
            { path: 'favorites', element: <Favorites /> },
            { path: 'inbox', element: <Inbox /> },
            { path: 'order-lists', element: <OrderLists /> },
            { path: 'pricing', element: <Pricing /> },
            { path: 'calendar', element: <Calendar /> },
            { path: 'todo', element: <Todo /> },
            { path: 'contact', element: <Contact /> },
            { path: 'invoice', element: <Invoice /> },
            { path: 'ui-elements', element: <UIElements /> },
            { path: 'team', element: <Team /> },
            { path: 'table', element: <Table /> }
        ],
    },

    // 3) 404 페이지
    {
        path: '*',
        element: <NotFound />,
    },
]);

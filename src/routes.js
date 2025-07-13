import Dashboard from 'layouts/dashboard';
import Users from 'layouts/users';
import Billing from 'layouts/bills';
import Profile from 'layouts/profile';
import SignIn from 'layouts/authentication/sign-in';

// @mui icons
import Icon from '@mui/material/Icon';

const routes = [
    {
        type: 'collapse',
        name: 'Dashboard',
        key: 'dashboard',
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: '/dashboard',
        component: <Dashboard />,
        requiresAuth: true
    },
    {
        type: 'collapse',
        name: 'Templates',
        key: 'templates',
        icon: <Icon fontSize="small">table_view</Icon>,
        route: '/templates',
        component: <Profile />,
        requiresAuth: true
    },
    {
        type: 'collapse',
        name: 'Billing',
        key: 'billing',
        icon: <Icon fontSize="small">receipt_long</Icon>,
        route: '/billing',
        component: <Billing />,
        requiresAuth: true
    },
    {
        type: 'collapse',
        name: 'Users',
        key: 'users',
        icon: <Icon fontSize="small">person</Icon>,
        route: '/users',
        component: <Users />,
        requiresAuth: true
    },
    {
        route: '/authentication/sign-in',
        component: <SignIn />,
        requiresAuth: false
    }
];

export default routes;

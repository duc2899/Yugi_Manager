import Dashboard from 'layouts/dashboard';
import Users from 'layouts/users';
import Tournaments from 'layouts/tournaments';
import DetailTournament from 'layouts/tournaments/detail';
import Cards from 'layouts/cards';
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
        name: 'Cards',
        key: 'cards',
        icon: <Icon fontSize="small">table_view</Icon>,
        route: '/cards',
        component: <Cards />,
        requiresAuth: true
    },
    {
        type: 'collapse',
        name: 'Tournaments',
        key: 'tournaments',
        icon: <Icon fontSize="small">receipt_long</Icon>,
        route: '/tournaments',
        component: <Tournaments />,
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
    },
    {
        route: '/tournaments/:id',
        component: <DetailTournament />,
        requiresAuth: true
    }
];

export default routes;

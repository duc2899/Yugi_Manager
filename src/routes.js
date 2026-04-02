import Dashboard from 'layouts/dashboard';
import Users from 'layouts/users';
import Tournaments from 'layouts/tournaments';
import DetailTournament from 'layouts/tournaments/detail';
import Cards from 'layouts/cards';
import SignIn from 'layouts/authentication/sign-in';

// @mui icons
import Icon from '@mui/material/Icon';
import AccountsAdmin from 'layouts/userAdmin';
import Forbidden from 'layouts/frobidden';

const routes = [
    {
        type: 'collapse',
        name: 'Tổng quan',
        key: 'dashboard',
        icon: <Icon fontSize="small">dashboard</Icon>,
        route: '/dashboard',
        component: <Dashboard />,
        requiresAuth: true,
        roles: ["ADMIN", "NORMAL"]
    },
    {
        type: 'collapse',
        name: 'Thẻ bài',
        key: 'cards',
        icon: <Icon fontSize="small">table_view</Icon>,
        route: '/cards',
        component: <Cards />,
        requiresAuth: true,
        roles: ["ADMIN", "NORMAL"]

    },
    {
        type: 'collapse',
        name: 'Tournaments',
        key: 'tournaments',
        icon: <Icon fontSize="small">receipt_long</Icon>,
        route: '/tournaments',
        component: <Tournaments />,
        requiresAuth: true,
        roles: ["ADMIN", "NORMAL"]
    },
    {
        type: 'collapse',
        name: 'Người chơi',
        key: 'users',
        icon: <Icon fontSize="small">person</Icon>,
        route: '/users',
        component: <Users />,
        requiresAuth: true,
        roles: ["ADMIN", "NORMAL"]
    },
    {
        type: 'collapse',
        name: 'Người dùng',
        key: 'users-admin',
        icon: <Icon fontSize="small">manage_accounts</Icon>,
        route: '/users-admin',
        component: <AccountsAdmin />,
        requiresAuth: true,
        roles: ["ADMIN"]
    },
    {
        route: '/authentication/sign-in',
        component: <SignIn />,
        requiresAuth: false,

    },
    {
        route: '/tournaments/:id',
        name: 'Tournaments',
        key: 'tournaments',
        component: <DetailTournament />,
        requiresAuth: true,
        roles: ["ADMIN", "NORMAL"]
    },
    {
        route: "/403",
        component: <Forbidden />,
        requiresAuth: false,
    }
];

export default routes;

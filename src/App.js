import { useState, useEffect } from 'react';
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigate
} from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Sidenav from 'examples/Sidenav';
import Configurator from 'examples/Configurator';

import theme from 'assets/theme';
import themeDark from 'assets/theme-dark';
import routes from 'routes';
import { useMaterialUIController, setMiniSidenav } from 'context';
import logo from './assets/images/logos/logo.png';

import { useAuth } from 'context/AuthContext';
// import LoadingScreen from 'layouts/loading';
import LoadingScreen from 'layouts/loading';
import { useDeviceGuard } from 'hooks/useDeviceGuard';

export default function App() {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, direction, layout, sidenavColor, darkMode } = controller;
    const { isAuthenticated, isLoading, user } = useAuth();

    useDeviceGuard();

    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    // 👉 Auto-redirect if user is already authenticated
    useEffect(() => {
        if (isAuthenticated && pathname === '/authentication/sign-in') {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, pathname, navigate]);

    useEffect(() => {
        document.body.setAttribute('dir', direction);
    }, [direction]);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }
    };

    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }
    };

    const getRoutes = (allRoutes) =>
        allRoutes.flatMap((route) => {
            if (route.collapse) return getRoutes(route.collapse);

            if (route.route) {
                // ===== AUTH CHECK =====
                if (route.requiresAuth && !isAuthenticated) {
                    return (
                        <Route
                            key={route.key}
                            path={route.route}
                            element={<Navigate to="/authentication/sign-in" replace />}
                        />
                    );
                }

                // ===== ROLE CHECK =====
                if (route.roles && route.roles.length > 0) {
                    const userRole = user?.role.toUpperCase();

                    if (!userRole || !route.roles.includes(userRole)) {
                        return (
                            <Route
                                key={route.key}
                                path={route.route}
                                element={<Navigate to="/403" replace />}
                            />
                        );
                    }
                }

                return (
                    <Route
                        key={route.key}
                        path={route.route}
                        element={route.component}
                    />
                );
            }

            return [];
        });

    if (isLoading) return <LoadingScreen />;

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
                <CssBaseline />
                {isAuthenticated && (
                    <>
                        {layout === 'dashboard' && (
                            <>
                                <Sidenav
                                    color={sidenavColor}
                                    brand={logo}
                                    brandName="Yugi Manager"
                                    routes={routes}
                                    onMouseEnter={handleOnMouseEnter}
                                    onMouseLeave={handleOnMouseLeave}
                                    role={user?.role.toUpperCase()}
                                />
                                <Configurator />
                            </>
                        )}
                        {layout === 'vr' && <Configurator />}
                    </>
                )}

                <Routes>
                    {getRoutes(routes)}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={isAuthenticated ? '/dashboard' : '/authentication/sign-in'}
                            />
                        }
                    />
                </Routes>
        </ThemeProvider>
    );
}

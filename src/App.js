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
import { AlertProvider } from 'context/AlertContext';
// import ConnectSSE from 'connecSSE';

export default function App() {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, direction, layout, sidenavColor, darkMode } = controller;
    const { isAuthenticated } = useAuth();

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

    const getRoutes = allRoutes =>
        allRoutes.flatMap(route => {
            if (route.collapse) return getRoutes(route.collapse);
            if (route.route) {
                if (route.requiresAuth && !isAuthenticated) {
                    return (
                        <Route
                            key={route.key}
                            path={route.route}
                            element={<Navigate to="/authentication/sign-in" />}
                        />
                    );
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

    // if (isLoading) return <LoadingScreen />;

    return (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
            <AlertProvider>
                <CssBaseline />
                {/* {isAuthenticated && ( */}
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
                                />
                                <Configurator />
                            </>
                        )}
                        {layout === 'vr' && <Configurator />}
                    </>
                {/* )} */}

                <Routes>
                    {getRoutes(routes)}
                    <Route
                        path="*"
                        element={
                             <Navigate
                                to={'/dashboard'}
                            />
                            // <Navigate
                            //     to={isAuthenticated ? '/dashboard' : '/authentication/sign-in'}
                            // />
                        }
                    />
                </Routes>
                {/* <ConnectSSE></ConnectSSE> */}
            </AlertProvider>
        </ThemeProvider>
    );
}

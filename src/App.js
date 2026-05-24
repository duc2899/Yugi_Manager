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

// Thay vì gọi trực tiếp, ta kiểm tra xem có phải đang chạy trong Electron không
const isElectron = /electron/i.test(navigator.userAgent);

// Chỉ lấy ipcRenderer nếu thực sự đang ở trong môi trường Electron
const ipcRenderer = isElectron ? window.require('electron').ipcRenderer : null;

const styles = {
    updateNotification: { position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#1f1f1f', color: '#ffffff', padding: '16px', borderRadius: '8px', boxShadow: '0px 4px 12px rgba(0,0,0,0.5)', zIndex: 9999, width: '300px', fontFamily: 'sans-serif', border: '1px solid #333' },
    progressBarBg: { backgroundColor: '#333', borderRadius: '4px', width: '100%', height: '8px', marginTop: '8px', overflow: 'hidden' },
    progressBarFill: { backgroundColor: '#00adb5', height: '100%', transition: 'width 0.2s ease-in-out' },
    updateBtn: { backgroundColor: '#00adb5', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textAlign: 'center' }
};

export default function App() {
    const [controller, dispatch] = useMaterialUIController();
    const { miniSidenav, direction, layout, sidenavColor, darkMode } = controller;
    const { isAuthenticated, isLoading, user } = useAuth();
    const [updateInfo, setUpdateInfo] = useState({ status: 'idle', percent: 0, version: '' });

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

    useEffect(() => {
        // Nếu chạy trên Web, ipcRenderer sẽ là null -> Thoát luôn, không chạy đống dưới, web không bị ảnh hưởng gì!
        if (!ipcRenderer) return;

        ipcRenderer.on('update-status', (event, data) => {
            setUpdateInfo(prev => ({ ...prev, status: data.status, version: data.version || prev.version }));
        });

        ipcRenderer.on('update-progress', (event, data) => {
            setUpdateInfo(prev => ({ ...prev, percent: data.percent }));
        });

        return () => {
            ipcRenderer.removeAllListeners('update-status');
            ipcRenderer.removeAllListeners('update-progress');
        };
    }, []);

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

    const handleRestart = () => {
        if (ipcRenderer) ipcRenderer.send('restart-app');
    };

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
            {updateInfo.status !== 'idle' && updateInfo.status !== 'error' && (
                <div style={styles.updateNotification}>
                    {/* Phần tiêu đề luôn hiển thị cố định */}
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                        {updateInfo.status === 'available' ? '🔄 Đang tải bản cập nhật...' : '🎉 Đã tải xong bản mới!'}
                    </p>

                    <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#ccc' }}>
                        Phiên bản: <b>v{updateInfo.version}</b>
                    </p>

                    {/* Thanh Progress Bar chạy xuyên suốt, tải xong thì đầy 100% */}
                    <div style={styles.progressBarBg}>
                        <div
                            style={{
                                ...styles.progressBarFill,
                                width: updateInfo.status === 'downloaded' ? '100%' : `${updateInfo.percent}%`,
                                backgroundColor: updateInfo.status === 'downloaded' ? '#4caf50' : '#00adb5' // Tải xong chuyển sang màu xanh lá chuẩn chỉ
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '12px', color: '#aaa' }}>
                            {updateInfo.status === 'downloaded' ? 'Hoàn tất 100%' : `Đã tải: ${updateInfo.percent}%`}
                        </span>
                    </div>

                    {/* Khi tải xong thì nhẹ nhàng mọc thêm cái nút kích hoạt cài đặt ở đây */}
                    {updateInfo.status === 'downloaded' && (
                        <button onClick={handleRestart} style={{ ...styles.updateBtn, marginTop: '12px', width: '100%' }}>
                            Khởi động lại để cập nhật
                        </button>
                    )}
                </div>
            )}
        </ThemeProvider>
    );
}

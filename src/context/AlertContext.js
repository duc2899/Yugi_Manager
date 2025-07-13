import MDAlert from 'components/MDAlert';
import { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = useCallback((message, color = 'info', timeout = 3000) => {
        const id = uuidv4();
        const newAlert = { id, message, color };
        setAlerts(prev => [...prev, newAlert]);

        setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== id));
        }, timeout);
    }, []);

    const dismissAlert = id => {
        setAlerts(prev => prev.filter(a => a.id !== id));
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div
                style={{
                    position: 'fixed',
                    top: 20,
                    right: 20,
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                {alerts.map(({ id, message, color }) => (
                    <div key={id} style={{ fontSize: '12px' }}>
                        <MDAlert color={color} dismissible onDismiss={() => dismissAlert(id)}>
                            {message}
                        </MDAlert>
                    </div>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

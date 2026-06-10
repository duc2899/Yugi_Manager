import { useState, useEffect } from 'react';

const isElectron = /electron/i.test(navigator.userAgent);
const ipcRenderer = isElectron ? window.require('electron').ipcRenderer : null;

export default function useUpdater() {
    const [updateInfo, setUpdateInfo] = useState({ status: 'idle', percent: 0, version: '' });

    useEffect(() => {
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

    const handleRestart = () => {
        if (ipcRenderer) ipcRenderer.send('restart-app');
    };

    return { updateInfo, handleRestart };
}
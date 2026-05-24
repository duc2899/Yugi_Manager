const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

let mainWindow; // Đưa biến này ra ngoài để các hàm khác dùng chung

function createUpdateListeners() {
    // 1. Cho phép tự động tải ngầm luôn khi tìm thấy bản mới
    autoUpdater.autoDownload = true;

    // Sự kiện 1: Phát hiện thấy có bản mới -> Thông báo cho React biết để hiện trạng thái "Đang tải"
    autoUpdater.on('update-available', (info) => {
        log.info('Có bản mới v' + info.version);
        if (mainWindow) {
            mainWindow.webContents.send('update-status', {
                status: 'available',
                version: info.version
            });
        }
    });

    // Sự kiện 2: Đang tải file - Electron liên tục gửi % về cho React vẽ Progress Bar
    autoUpdater.on('download-progress', (progressObj) => {
        log.info(`Đang tải: ${progressObj.percent}%`);
        if (mainWindow) {
            mainWindow.webContents.send('update-progress', {
                percent: Math.round(progressObj.percent),
                bytesPerSecond: progressObj.bytesPerSecond
            });
        }
    });

    // Sự kiện 3: Đã tải xong bản cập nhật thành công
    autoUpdater.on('update-downloaded', (info) => {
        log.info('Đã tải xong bản v' + info.version);
        if (mainWindow) {
            mainWindow.webContents.send('update-status', {
                status: 'downloaded',
                version: info.version
            });
        }
    });

    autoUpdater.on('error', (err) => {
        log.error('Lỗi tự động cập nhật:', err);
        if (mainWindow) {
            mainWindow.webContents.send('update-status', { status: 'error' });
        }
    });
}

// Lắng nghe lệnh từ giao diện React khi user bấm nút "Khởi động lại để cập nhật"
ipcMain.on('restart-app', () => {
    autoUpdater.quitAndInstall();
});

function createWindow() {
    mainWindow = new BrowserWindow({ // Gán vào biến global vừa tạo ở trên
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Giữ nguyên theo config hiện tại của ông để React sài trực tiếp ipcRenderer
        },
    });

    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
}

app.whenReady().then(() => {
    createWindow();
    createUpdateListeners();

    setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
    }, 3000);
});

// ... các phần window-all-closed giữ nguyên
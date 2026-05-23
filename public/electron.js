const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// 1. Cấu hình log để kiểm tra lỗi nếu có (File log lưu ở AppData của máy user)
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('Ứng dụng đang khởi động...');

function createUpdateListeners() {
    // Tắt tự động tải ngầm, mình sẽ hỏi ý kiến user trước khi tải
    autoUpdater.autoDownload = false;

    // Sự kiện 1: Phát hiện có bản cập nhật mới trên GitHub
    autoUpdater.on('update-available', (info) => {
        log.info('Tìm thấy bản cập nhật mới:', info.version);
        
        dialog.showMessageBox({
            type: 'info',
            title: 'Có bản cập nhật mới!',
            message: `Phiên bản v${info.version} đã sẵn sàng. Bạn có muốn tải về ngầm không?`,
            buttons: ['Tải về ngầm', 'Để sau'],
            defaultId: 0,
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                autoUpdater.downloadUpdate(); // Bắt đầu tải file exe về máy ngầm
                log.info('User đồng ý tải bản cập nhật.');
            }
        });
    });

    // Sự kiện 2: Đã tải xong file .exe bản mới về máy thành công
    autoUpdater.on('update-downloaded', (info) => {
        log.info('Đã tải xong bản cập nhật v', info.version);

        dialog.showMessageBox({
            type: 'info',
            title: 'Tải về hoàn tất!',
            message: 'Bản cập nhật đã được tải xong. Khởi động lại ứng dụng để áp dụng ngay?',
            buttons: ['Cập nhật ngay', 'Để sau'],
            defaultId: 0,
            cancelId: 1
        }).then(result => {
            if (result.response === 0) {
                // Tắt app và kích hoạt file .exe vừa tải để tự động cài đè luôn
                autoUpdater.quitAndInstall(); 
            }
        });
    });

    // Sự kiện phụ: Quản lý lỗi nếu quá trình check/download thất bại
    autoUpdater.on('error', (err) => {
        log.error('Lỗi Auto Update:', err);
    });
}

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile(path.join(__dirname, '../build/index.html'));
}

app.whenReady().then(() => {
    createWindow();
    
    // Khởi tạo các bộ lắng nghe sự kiện update
    createUpdateListeners();

    // Chờ 3 giây sau khi mở app rồi kích hoạt kiểm tra update
    setTimeout(() => {
        autoUpdater.checkForUpdatesAndNotify();
    }, 3000);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
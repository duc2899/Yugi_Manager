const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');
const https = require('https');

function checkForUpdates() {
    const currentVersion = app.getVersion();

    https.get('https://api.github.com/repos/duc2899/Yugi_Manager/releases/latest', {
        headers: { 'User-Agent': 'YugiManager' }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            const latest = JSON.parse(data);
            const latestVersion = latest.tag_name.replace('v', '');

            if (latestVersion !== currentVersion) {
                dialog.showMessageBox({
                    type: 'info',
                    title: 'Có bản cập nhật mới!',
                    message: `Phiên bản ${latestVersion} đã có. Tải về ngay?`,
                    buttons: ['Tải về', 'Bỏ qua']
                }).then(result => {
                    if (result.response === 0) {
                        // Dẫn thẳng đến link download file exe
                        const downloadUrl = `https://github.com/duc2899/Yugi_Manager/releases/download/${latest.tag_name}/YugiManagerSetup.exe`;
                        shell.openExternal(downloadUrl);
                    }
                });
            }
        });
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
    checkForUpdates();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
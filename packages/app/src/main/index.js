import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let mainWindow = null;
let tray = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path.join(__dirname, '../../ui/dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
    mainWindow.on('minimize', (event) => {
        event.preventDefault();
        mainWindow?.hide();
    });
}
function createTray() {
    const icon = nativeImage.createFromPath(path.join(__dirname, '../../assets/icon.png'));
    tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open NEXUS', click: () => mainWindow?.show() },
        { label: 'New Task', click: () => mainWindow?.show() },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() },
    ]);
    tray.setToolTip('NEXUS - AI Agent');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
        mainWindow?.show();
    });
}
app.whenReady().then(() => {
    createWindow();
    createTray();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
ipcMain.handle('minimize-window', () => {
    mainWindow?.minimize();
});
ipcMain.handle('maximize-window', () => {
    if (mainWindow?.isMaximized()) {
        mainWindow.unmaximize();
    }
    else {
        mainWindow?.maximize();
    }
});
ipcMain.handle('close-window', () => {
    mainWindow?.close();
});
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});
//# sourceMappingURL=index.js.map
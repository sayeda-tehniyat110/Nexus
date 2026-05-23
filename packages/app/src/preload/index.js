import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('electronAPI', {
    minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
    maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
    closeWindow: () => ipcRenderer.invoke('close-window'),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    on: (channel, callback) => {
        ipcRenderer.on(channel, callback);
    },
    off: (channel, callback) => {
        ipcRenderer.off(channel, callback);
    },
});
//# sourceMappingURL=index.js.map
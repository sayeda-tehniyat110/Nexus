import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, callback);
  },
  off: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.off(channel, callback);
  },
});

declare global {
  interface Window {
    electronAPI: {
      minimizeWindow: () => Promise<void>;
      maximizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
      getAppVersion: () => Promise<string>;
      on: (channel: string, callback: (...args: unknown[]) => void) => void;
      off: (channel: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}

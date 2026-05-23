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
export {};
//# sourceMappingURL=index.d.ts.map
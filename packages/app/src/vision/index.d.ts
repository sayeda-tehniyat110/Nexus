export declare class ScreenVision {
    private pcController;
    constructor(pythonPath?: string);
    captureScreen(display?: number): Promise<string>;
    captureRegion(x: number, y: number, width: number, height: number): Promise<string>;
    extractText(image: string): Promise<string>;
    getScreenInfo(): Promise<{
        width: number;
        height: number;
        displays: number;
    }>;
}
//# sourceMappingURL=index.d.ts.map
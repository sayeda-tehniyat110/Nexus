import { PCController } from '@nexus/pc-control';
export class ScreenVision {
    pcController;
    constructor(pythonPath = 'python') {
        this.pcController = new PCController(pythonPath);
    }
    async captureScreen(display = 0) {
        const result = await this.pcController.screenshot(display);
        if (!result.success) {
            throw new Error(result.error || 'Failed to capture screen');
        }
        return result.data;
    }
    async captureRegion(x, y, width, height) {
        const script = 'import mss; import base64; sct = mss.mss(); monitor = {"top": ' + y + ', "left": ' + x + ', "width": ' + width + ', "height": ' + height + '}; screenshot = sct.grab(monitor); print(base64.b64encode(mss.tools.to_png(screenshot.rgb, screenshot.size)).decode())';
        const result = await this.pcController['runPythonScript'](script);
        return result;
    }
    async extractText(image) {
        const result = await this.pcController.ocr(image);
        if (!result.success) {
            throw new Error(result.error || 'Failed to extract text');
        }
        return result.data;
    }
    async getScreenInfo() {
        const script = 'import mss; import json; sct = mss.mss(); print(json.dumps({"displays": len(sct.monitors) - 1, "width": sct.monitors[1]["width"], "height": sct.monitors[1]["height"]}))';
        const result = await this.pcController['runPythonScript'](script);
        return JSON.parse(result);
    }
}
//# sourceMappingURL=index.js.map
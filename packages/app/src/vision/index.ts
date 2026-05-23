import { PCController } from '@nexus/pc-control';
import type { ActionResult } from '@nexus/pc-control';

export class ScreenVision {
  private pcController: PCController;

  constructor(pythonPath: string = 'python') {
    this.pcController = new PCController(pythonPath);
  }

  async captureScreen(display: number = 0): Promise<string> {
    const result: ActionResult = await this.pcController.screenshot(display);
    if (!result.success) {
      throw new Error(result.error || 'Failed to capture screen');
    }
    return result.data as string;
  }

  async captureRegion(x: number, y: number, width: number, height: number): Promise<string> {
    const script = 'import mss; import base64; sct = mss.mss(); monitor = {"top": ' + y + ', "left": ' + x + ', "width": ' + width + ', "height": ' + height + '}; screenshot = sct.grab(monitor); print(base64.b64encode(mss.tools.to_png(screenshot.rgb, screenshot.size)).decode())';
    const result = await this.pcController['runPythonScript'](script);
    return result;
  }

  async extractText(image: string): Promise<string> {
    const result: ActionResult = await this.pcController.ocr(image);
    if (!result.success) {
      throw new Error(result.error || 'Failed to extract text');
    }
    return result.data as string;
  }

  async getScreenInfo(): Promise<{ width: number; height: number; displays: number }> {
    const script = 'import mss; import json; sct = mss.mss(); print(json.dumps({"displays": len(sct.monitors) - 1, "width": sct.monitors[1]["width"], "height": sct.monitors[1]["height"]}))';
    const result = await this.pcController['runPythonScript'](script);
    return JSON.parse(result);
  }
}

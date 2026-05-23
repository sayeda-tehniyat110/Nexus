import { spawn } from 'child_process';
import { readFile, writeFile, unlink, rename, copyFile, readdir, stat } from 'fs/promises';
import type { MouseAction, KeyboardAction, FileAction, AppAction, ActionResult, MouseParams, KeyboardParams, FileParams, AppParams } from './types';

export class PCController {
  private pythonPath: string;
  private humanLikeDelay: boolean = true;

  constructor(pythonPath: string = 'python', humanLikeDelay: boolean = true) {
    this.pythonPath = pythonPath;
    this.humanLikeDelay = humanLikeDelay;
  }

  setHumanLikeDelay(enabled: boolean): void {
    this.humanLikeDelay = enabled;
  }

  private async delay(ms: number): Promise<void> {
    if (this.humanLikeDelay) {
      await new Promise(resolve => setTimeout(resolve, ms));
    }
  }

  private getRandomDelay(min: number = 30, max: number = 80): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async mouse(action: MouseAction, params: MouseParams = {}): Promise<ActionResult> {
    try {
      const script = this.getMouseScript(action, params);
      const result = await this.runPythonScript(script);
      await this.delay(this.getRandomDelay());
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async keyboard(action: KeyboardAction, params: KeyboardParams = {}): Promise<ActionResult> {
    try {
      const script = this.getKeyboardScript(action, params);
      const result = await this.runPythonScript(script);
      await this.delay(this.getRandomDelay());
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async file(action: FileAction, params: FileParams): Promise<ActionResult> {
    try {
      switch (action) {
        case 'read':
          const content = await readFile(params.path, 'utf-8');
          return { success: true, data: content };
        case 'write':
          await writeFile(params.path, params.content || '', 'utf-8');
          return { success: true };
        case 'delete':
          await unlink(params.path);
          return { success: true };
        case 'move':
          await rename(params.path, params.destination!);
          return { success: true };
        case 'copy':
          await copyFile(params.path, params.destination!);
          return { success: true };
        case 'list':
          const files = await readdir(params.path);
          const fileDetails = await Promise.all(
            files.map(async (file) => {
              const filePath = params.path + '/' + file;
              const stats = await stat(filePath);
              return { name: file, isDirectory: stats.isDirectory(), size: stats.size };
            })
          );
          return { success: true, data: fileDetails };
        default:
          return { success: false, error: 'Unknown file action: ' + action };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async app(action: AppAction, params: AppParams = {}): Promise<ActionResult> {
    try {
      switch (action) {
        case 'launch':
          if (params.path) {
            spawn(params.path, [], { detached: true, shell: true });
          } else if (params.name) {
            spawn('cmd', ['/c', 'start', '', params.name], { detached: true, shell: true });
          }
          return { success: true };
        case 'close':
          if (params.pid) {
            spawn('taskkill', ['/PID', String(params.pid), '/F']);
          }
          return { success: true };
        case 'list':
          const result = await this.runPythonScript('import psutil; import json; processes = []; [processes.append({"pid": p.info["pid"], "name": p.info["name"], "exe": p.info["exe"]}) for p in psutil.process_iter(["pid", "name", "exe"])]; print(json.dumps(processes))');
          return { success: true, data: JSON.parse(result) };
        default:
          return { success: false, error: 'Unknown app action: ' + action };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async screenshot(display: number = 0): Promise<ActionResult> {
    try {
      const script = 'import mss; import base64; sct = mss.mss(); monitor = sct.monitors[1 + ' + display + ']; screenshot = sct.grab(monitor); print(base64.b64encode(mss.tools.to_png(screenshot.rgb, screenshot.size)).decode())';
      const result = await this.runPythonScript(script);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  async ocr(image: string): Promise<ActionResult> {
    try {
      const script = 'import base64; import pytesseract; from PIL import Image; import io; img = Image.open(io.BytesIO(base64.b64decode("' + image + '"))); print(pytesseract.image_to_string(img))';
      const result = await this.runPythonScript(script);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  private getMouseScript(action: MouseAction, params: MouseParams): string {
    const { x, y, button = 'left', clicks = 1, dx, dy, duration = 0.5 } = params;

    switch (action) {
      case 'move':
        return 'import pyautogui; import time; start_x, start_y = pyautogui.position(); end_x, end_y = ' + x + ', ' + y + '; steps = 20; [pyautogui.moveTo(start_x + (end_x - start_x) * i / steps, start_y + (end_y - start_y) * i / steps) or time.sleep(' + duration + ' / steps) for i in range(steps + 1)]';
      case 'click':
        return 'import pyautogui; pyautogui.click(x=' + x + ', y=' + y + ', button="' + button + '", clicks=' + clicks + ')';
      case 'right_click':
        return 'import pyautogui; pyautogui.rightClick(x=' + x + ', y=' + y + ')';
      case 'double_click':
        return 'import pyautogui; pyautogui.doubleClick(x=' + x + ', y=' + y + ')';
      case 'scroll':
        return 'import pyautogui; pyautogui.scroll(' + dy + ', x=' + x + ', y=' + y + ')';
      case 'drag':
        return 'import pyautogui; pyautogui.dragTo(' + x + ', ' + y + ', duration=' + duration + ')';
      default:
        throw new Error('Unknown mouse action: ' + action);
    }
  }

  private getKeyboardScript(action: KeyboardAction, params: KeyboardParams): string {
    const { text, key, keys } = params;

    switch (action) {
      case 'type':
        return 'import pyautogui; import time; import random; [pyautogui.write(c) or time.sleep(random.uniform(0.03, 0.08)) for c in """' + text + '"""]';
      case 'press':
        return 'import pyautogui; pyautogui.press("' + key + '")';
      case 'hotkey':
        return 'import pyautogui; pyautogui.hotkey(' + (keys || []).map(k => '"' + k + '"').join(', ') + ')';
      default:
        throw new Error('Unknown keyboard action: ' + action);
    }
  }

  private async runPythonScript(script: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const python = spawn(this.pythonPath, ['-c', script]);
      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      python.on('close', (code) => {
        if (code === 0) {
          resolve(stdout.trim());
        } else {
          reject(new Error(stderr || 'Python exited with code ' + code));
        }
      });
    });
  }
}

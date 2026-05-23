import { spawn } from "child_process";
pythonPath: string;
humanLikeDelay: boolean = true;
constructor(pythonPath, string = "python", humanLikeDelay, boolean = true);
{
    this.pythonPath = pythonPath;
    this.humanLikeDelay = humanLikeDelay;
}
setHumanLikeDelay(enabled, boolean);
void {
    this: .humanLikeDelay = enabled
};
async;
delay(ms, number);
Promise < void  > {
    : .humanLikeDelay
};
{
    await new Promise(resolve => setTimeout(resolve, ms));
}
getRandomDelay(min, number = 30, max, number = 80);
number;
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
async;
file(action, FileAction, params, FileParams);
Promise < ActionResult > {
    try: {
        switch(action) {
        },
        case: "read",
        const: content = await readFile(params.path, "utf-8"),
        return: { success: true, data: content },
        case: "write",
        await, writeFile(params) { }, : .path, params, : .content || "", "utf-8": ,
        return: { success: true },
        case: "delete",
        await, unlink(params) { }, : .path,
        return: { success: true },
        case: "move",
        await, rename(params) { }, : .path, params, : .destination,
        return: { success: true },
        case: "copy",
        await, copyFile(params) { }, : .path, params, : .destination,
        return: { success: true },
        case: "list",
        const: files = await readdir(params.path),
        const: fileDetails = await Promise.all(files.map(async (file) => {
            const filePath = params.path + "/" + file;
            const stats = await stat(filePath);
            return { name: file, isDirectory: stats.isDirectory(), size: stats.size };
        })),
        return: { success: true, data: fileDetails },
        default: ,
        return: { success: false, error: "Unknown file action: " + action }
    }
};
try { }
catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
}
async;
screenshot(display, number = 0);
Promise < ActionResult > {
    try: {
        const: script = "import mss; import base64; sct = mss.mss(); monitor = sct.monitors[1 + " + display + "]; screenshot = sct.grab(monitor); print(base64.b64encode(mss.tools.to_png(screenshot.rgb, screenshot.size)).decode())",
        const: result = await this.runPythonScript(script),
        return: { success: true, data: result }
    }, catch(error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
};
async;
ocr(image, string);
Promise < ActionResult > {
    try: {
        const: script = 'import base64; import pytesseract; from PIL import Image; import io; img = Image.open(io.BytesIO(base64.b64decode("' + image + '"))); print(pytesseract.image_to_string(img))',
        const: result = await this.runPythonScript(script),
        return: { success: true, data: result }
    }, catch(error) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
};
getMouseScript(action, MouseAction, params, MouseParams);
string;
{
    const { x, y, button = "left", clicks = 1, dx, dy, duration = 0.5 } = params;
    switch (action) {
        case "move":
            return "import pyautogui; import time; start_x, start_y = pyautogui.position(); end_x, end_y = " + x + ", " + y + "; steps = 20; [pyautogui.moveTo(start_x + (end_x - start_x) * i / steps, start_y + (end_y - start_y) * i / steps) or time.sleep(" + duration + " / steps) for i in range(steps + 1)]";
        case "click":
            return "import pyautogui; pyautogui.click(x=" + x + ", y=" + y + ', button="' + button + '", clicks=' + clicks + ")";
        case "right_click":
            return "import pyautogui; pyautogui.rightClick(x=" + x + ", y=" + y + ")";
        case "double_click":
            return "import pyautogui; pyautogui.doubleClick(x=" + x + ", y=" + y + ")";
        case "scroll":
            return "import pyautogui; pyautogui.scroll(" + dy + ", x=" + x + ", y=" + y + ")";
        case "drag":
            return "import pyautogui; pyautogui.dragTo(" + x + ", " + y + ", duration=" + duration + ")";
        default:
            throw new Error("Unknown mouse action: " + action);
    }
}
async;
runPythonScript(script, string);
Promise < string > {
    return: new Promise((resolve, reject) => {
        const python = spawn(this.pythonPath, ["-c", script]);
        let stdout = "";
        let stderr = "";
        python.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        python.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        python.on("close", (code) => {
            if (code === 0) {
                resolve(stdout.trim());
            }
            else {
                reject(new Error(stderr || "Python exited with code " + code));
            }
        });
    })
};
//# sourceMappingURL=controller.js.map
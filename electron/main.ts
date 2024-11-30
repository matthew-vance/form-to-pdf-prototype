import { app, BrowserWindow, screen } from "electron";
import url from "url";
import { join } from "node:path";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const win = new BrowserWindow({
    width,
    height,
    webPreferences: {
      preload: join(__dirname, "preload.ts"),
    },
  });

  win.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

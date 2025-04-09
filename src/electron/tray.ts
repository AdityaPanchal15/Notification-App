import { Tray, BrowserWindow, screen, Menu } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAssetPath, getPreloadPath } from './pathResolver.js';
import { isDev } from './util.js';
import { app } from "electron";

const __filename = fileURLToPath(import.meta.url);

let popupWindow: BrowserWindow;

export function createTray() {
  const iconPath = path.join(getAssetPath(), process.platform === "darwin" ? "trayIconTemplate.png" : "trayIcon.png");
  const tray = new Tray(iconPath);
  
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: "Quit",
      click: () => app.quit()
    }
  ]));

  tray.on('click', (_, bounds) => {
    if (popupWindow && popupWindow.isVisible()) {
      popupWindow.hide();
    } else {      
      showPopup(bounds);
    }
  });
}

function showPopup(bounds: Electron.Rectangle) {
  const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
  const screenWidth = display.workArea.width;
  const screenHeight = display.workArea.height;

  const popupWidth = 400;
  const popupHeight = 400;

  const x = Math.min(bounds.x, screenWidth - popupWidth);
  const y = Math.min(bounds.y, screenHeight - popupHeight);

  popupWindow = new BrowserWindow({
    width: popupWidth,
    height: popupHeight,
    x,
    y,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev()) {
    popupWindow.loadURL('http://localhost:5123/popup.html');
  } else {
    const filePath = path.join(app.getAppPath(), '/dist-react/popup.html');;
    popupWindow.loadFile(filePath);
  }

  popupWindow.on('blur', () => popupWindow.hide());
}

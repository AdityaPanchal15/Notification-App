// main.js
import { Tray, BrowserWindow, screen, Menu, app, ipcMain, shell } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAssetPath, getPreloadPath } from './pathResolver.js';
import { isDev } from './util.js';

const __filename = fileURLToPath(import.meta.url);

let tray: Tray | null = null;
let popupWindow: BrowserWindow | null = null;
let notificationData: string[] = []; // Store notifications persistently

export function createTray() {
  const iconPath = path.join(
    getAssetPath(),
    process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'
  );
  
  tray = new Tray(iconPath);
  tray.setToolTip('Notification App');
  
  // Initial menu with no notifications
  updateTrayMenu();

  tray.on('click', (_, bounds) => {
    if (popupWindow && popupWindow.isVisible()) {
      popupWindow.hide();
    } else {
      showPopup(bounds);
    }
  });

  return tray;
}

// Update tray menu with stored notifications
export function updateTrayMenu() {
  if (!tray || tray.isDestroyed()) {
    createTray();
  }
  const menuItems = notificationData.length
    ? notificationData.map((msg, idx) => ({ label: msg }))
    : [{ label: 'No notifications yet' }];
  
  const contextMenu = Menu.buildFromTemplate([
    ...menuItems,
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() },
  ]);
  tray?.setContextMenu(contextMenu);
}

function showPopup(bounds: Electron.Rectangle) {
  const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
  const screenWidth = display.workArea.width;
  const screenHeight = display.workArea.height;

  const popupWidth = 400;
  const popupHeight = 600;

  const x = Math.min(bounds.x, screenWidth - popupWidth);
  const y = Math.min(bounds.y, screenHeight - popupHeight);

  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.setPosition(x, y);
    popupWindow.show();
    popupWindow.webContents.send('update-notifications', notificationData); // Send data to popup
  } else {
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
        nodeIntegration: true,
      },
    });

    if (isDev()) {
      popupWindow.loadURL('http://localhost:5123/popup.html');
    } else {
      const filePath = path.join(app.getAppPath(), 'dist-react/popup.html');
      popupWindow.loadFile(filePath);
    }

    popupWindow.on('blur', () => popupWindow?.hide());
    popupWindow.webContents.on('did-finish-load', () => {
      popupWindow?.webContents.send('update-notifications', notificationData); // Initial data load
    });
  }
}

// Handle WebSocket notifications from renderer (React)
ipcMain.on('new-notification', (event, data) => {
  notificationData.push(data.message); // Store the notification
  updateTrayMenu(); // Update tray with new data
  if (popupWindow && !popupWindow.isDestroyed() && popupWindow.isVisible()) {
    popupWindow.webContents.send('update-notifications', notificationData); // Update popup
  }
});

// Listen for URL open requests from renderer
ipcMain.on('open-url', (_, url: string) => {
  shell.openExternal(url);
});

// Optional: Clear notifications if needed
ipcMain.on('clear-notifications', () => {
  notificationData = [];
  updateTrayMenu();
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.webContents.send('update-notifications', notificationData);
  }
});
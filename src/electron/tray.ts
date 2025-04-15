// main.js
import { Tray, BrowserWindow, screen, Menu, app, ipcMain, shell } from 'electron';
import path from 'path';
import { getAssetPath, getPreloadPath } from './pathResolver.js';
import { handleCloseEvents, isDev } from './util.js';
import { clearTokens, isLoggedIn, setTokens } from './tokenManager.js';

let tray: Tray | null = null;
let popupWindow: BrowserWindow | null = null;
let notificationData: string[] = []; // Store notifications persistently

export function createTray() {
  const iconPath = path.join(
    getAssetPath(),
    process.platform === 'darwin' ? 'trayIconTemplate.png' : 'trayIcon.png'
  );
  
  tray = new Tray(iconPath);
  tray.setToolTip('Notification | Electron');
  
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

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    resizable: true,
    webPreferences: {
      preload: getPreloadPath(), // <- make sure this is correct
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5123'); // <- adjust if your React index page differs
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react/index.html'));
  }
  return mainWindow;
}

// Function to create a login popup
const openPage = (url: string) => {
  const pageWindow = createWindow();
  pageWindow?.webContents.on('did-finish-load', () => {
    pageWindow?.webContents.send('navigate-to', url);
  });

  pageWindow?.show();
  pageWindow?.focus();
  handleCloseEvents(pageWindow);
};

// Update tray menu with stored notifications
export function updateTrayMenu() {
  if (!tray || tray.isDestroyed()) {
    createTray();
  }
  
  const dynamicMenu = [];
  if (isLoggedIn()) {
    dynamicMenu.push({
      label: 'Logout',
      click: () => {
        console.log('Logout clicked');
        clearTokens();
        updateTrayMenu();
        openPage('/login');
      },
      icon: path.join(getAssetPath(), 'icons', 'logout.png'),
    });
  } else {
    dynamicMenu.push({
      label: 'Login',
      click: () => openPage('/login'),
      icon: path.join(getAssetPath(), 'icons', 'login.png'),
    });
  }
  
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Popout', 
      click: () => {
        openPage('/notifications')
      },
      icon: path.join(getAssetPath(), 'icons', 'popout.png')
    },
    { 
      label: 'Preferences', 
      click: () => {
        openPage('/preferences');
      },
      icon: path.join(getAssetPath(), 'icons', 'preferences.png')
    },
    ...dynamicMenu,
    { 
      label: 'Quit', 
      click: () => app.quit(),
      icon: path.join(getAssetPath(), 'icons', 'quit.png')
    },
  ]);
  tray?.setContextMenu(contextMenu);
}

function showPopup(bounds: Electron.Rectangle) {
  const display = screen.getDisplayNearestPoint({ x: bounds.x, y: bounds.y });
  const screenWidth = display.workArea.width;
  const screenHeight = display.workArea.height;

  const popupWidth = 380;
  const popupHeight = 800;

  const x = Math.min(bounds.x, screenWidth - popupWidth);
  const y = Math.min(bounds.y, screenHeight - popupHeight);

  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.setPosition(x, y);
    popupWindow.show();
    popupWindow.webContents.send("update-notifications", notificationData); // Send data to popup
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
      backgroundColor: "#e9e9e9",
      webPreferences: {
        preload: getPreloadPath(),
        contextIsolation: true,
        nodeIntegration: true,
      },
    });

    if (isDev()) {
      popupWindow.loadURL("http://localhost:5123/popup.html");
    } else {
      const filePath = path.join(app.getAppPath(), "dist-react/popup.html");
      popupWindow.loadFile(filePath);
    }

    popupWindow.on("blur", () => popupWindow?.hide());
    popupWindow.webContents.on("did-finish-load", () => {
      popupWindow?.webContents.send("update-notifications", notificationData); // Initial data load
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

ipcMain.on('store-tokens', (_, { accessToken, refreshToken }) => {
  setTokens(accessToken, refreshToken);
  updateTrayMenu();
});

ipcMain.on('clear-tokens', () => {
  clearTokens();
  updateTrayMenu();
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
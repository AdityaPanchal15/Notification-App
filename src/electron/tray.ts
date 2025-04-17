// main.js
import { Tray, BrowserWindow, screen, Menu, app, ipcMain, shell } from 'electron';
import path from 'path';
import { getAssetPath, getPreloadPath } from './pathResolver.js';
import { handleCloseEvents, isDev } from './util.js';
import { Notification } from 'electron';
import { clearTokens, getAuth, isLoggedIn, setTokens } from './tokenManager.js';

let tray: Tray | null = null;
let popupWindow: BrowserWindow | null = null;
let notificationData: string[] = []; // Store notifications persistently
let loginWindow: BrowserWindow | null = null;

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
    minimizable: false,
    maximizable: false,
    webPreferences: {
      preload: getPreloadPath(), // <- make sure this is correct
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  
  mainWindow.setMenu(null);

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
  if (url === '/login') {
    loginWindow = pageWindow;
  }
  pageWindow?.webContents.on('did-finish-load', () => {
    pageWindow?.webContents.send('navigate-to', url);
  });
  
  pageWindow?.on('closed', () => {
    if (loginWindow === pageWindow) {
      loginWindow = null;
    }
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
    const auth = getAuth();
    dynamicMenu.push({ 
      label: auth.firstName + ' ' + auth.lastName, 
      icon: path.join(getAssetPath(), 'icons', 'user.png')
    })
    dynamicMenu.push({ type: 'separator' as const })
    dynamicMenu.push({ 
      label: 'Popout', 
      click: () => {
        openPage('/notifications')
      },
      icon: path.join(getAssetPath(), 'icons', 'popout.png')
    })
    dynamicMenu.push({ 
      label: 'Preferences', 
      click: () => {
        openPage('/preferences');
      },
      icon: path.join(getAssetPath(), 'icons', 'preferences.png')
    })
    dynamicMenu.push({
      label: 'Logout',
      click: () => {
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

ipcMain.on('setAuth', (_, auth) => {
  setTokens(auth);
  updateTrayMenu();
  
  // On login show notification and close login window.
  if (loginWindow && !loginWindow.isDestroyed()) {
    const notification = new Notification({
      title: "Login Successful",
      body: "User logged in successfully.",
    });
  
    notification.show();
    loginWindow.close(); // 🔒 closes the login window
    loginWindow = null;
  }
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
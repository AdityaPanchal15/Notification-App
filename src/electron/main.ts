import { app, BrowserWindow, Notification } from "electron";
import { ipcMainHandle, isDev } from './util.js';
import { createTray } from './tray.js';
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

let notifications: any[] = [];

app.setAppUserModelId('Notification | Electron');
app.on("ready", () => {
  // Start background WebSocket
  startWebSocket();

  ipcMainHandle("storeNotification", ({ title, body }) => {
    const data = { title, body, timestamp: Date.now() };
    notifications.push(data);
  });
  ipcMainHandle("deleteNotification", ({ notificationIndex }) => {
    if (notificationIndex == -1) {
      notifications = [];
      return;
    }
    notifications.splice(notificationIndex, 1);
  });
  ipcMainHandle("getNotifications", () => {
    console.log("getNotification", notifications);

    return notifications;
  });
  createTray();
});

function startWebSocket() {
  let socket: WebSocket;

  const connect = () => {
    socket = new WebSocket("ws://localhost:8086");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const { title, body, app } = JSON.parse(event.data);
      const notif = { title, app, body, timestamp: Date.now() };

      // Store it
      notifications.unshift(notif);
      
      // ✅ Show system notification
      downloadImage(body.image, (localPath: string) => {
        if (!localPath) return;
    
        const notification = new Notification({
          title,
          body: body.message,
          icon: localPath, // Local path to the downloaded image
        });
    
        notification.show();
      });
      
      // Send to all open windows (e.g., tray popup)
      BrowserWindow.getAllWindows().forEach((win) => {
        win.webContents.send("new-notification", notif);
      });
      console.log("notifications=>", notifications);
    };

    socket.onclose = () => {
      console.log("Socket closed. Reconnecting...");
      setTimeout(connect, 2000);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
      socket.close();
    };
  };

  connect();
}

// Download image to show in system's notification.
function downloadImage(url: string, callback: any) {
  const tempPath = path.join(os.tmpdir(), 'notification-icon.png');
  const file = fs.createWriteStream(tempPath);
  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close(() => callback(tempPath));
    });
  }).on('error', (err) => {
    console.error('Image download failed:', err.message);
    callback(null);
  });
}
import { app, BrowserWindow, Notification } from "electron";
import { ipcMainHandle, isDev } from './util.js';
import { createTray } from './tray.js';

let notifications: any[] = [];

function startWebSocket() {
  let socket: WebSocket;

  const connect = () => {
    socket = new WebSocket("ws://localhost:8086");

    socket.onopen = () => {
      console.log("WebSocket connected");
    };

    socket.onmessage = (event) => {
      const { title, body } = JSON.parse(event.data);
      const notif = { title, body, timestamp: Date.now() };

      // Store it
      notifications.unshift(notif);
      
      // ✅ Show system notification
      new Notification({ title, body: body.message }).show();

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
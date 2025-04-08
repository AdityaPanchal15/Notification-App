import { ipcRenderer } from 'electron';

const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatics: (callback) =>
    ipcOn("statistics", (stats) => {
      callback(stats);
    }),
  subscribeChangeView: (callback) =>
    ipcOn("changeView", (stats) => {
      callback(stats);
    }),
  getStaticData: () => ipcInvoke('getStaticData'),
  
  // 🆕 Subscribe to broadcast messages
  onBroadcastMessage: (callback: (msg: { title: string, body: string, icon: string }) => void) => {
    ipcRenderer.on("broadcastMessage", (_, msg) => callback(msg));
  },

  // 🆕 Send message to broadcast
  sendBroadcastMessage: (message: string) =>
    ipcInvoke("sendBroadcastMessage", message),
  
  showNotification: (title: string, body: any) => {
    new Notification(title, {  
      body,
      // icon: body.icon ? path.join(__dirname, body.icon) : undefined
    });
  }
  
  
} satisfies Window['electron']);

export const ipcInvoke = (channel: string, ...args: any[]): Promise<any> => {
  return ipcRenderer.invoke(channel, ...args);
};

export function ipcOn<Key extends keyof EventPayloadMapping>(key: Key, callback: (payload: EventPayloadMapping[Key]) => void) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload); 
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
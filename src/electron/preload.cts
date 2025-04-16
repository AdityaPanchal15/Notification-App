import { ipcRenderer } from 'electron';

const electron = require('electron');

electron.contextBridge.exposeInMainWorld("electron", { 
  showNotification: (title: string, body: any) => {
    ipcRenderer.invoke('storeNotification', { title, body });
  },
  deleteNotification: (notificationIndex: number) => {
    ipcRenderer.invoke('deleteNotification', { notificationIndex });
  },
  getNotifications: (): Promise<any[]> => ipcRenderer.invoke('getNotifications'),
  
  on: (channel: string, listener: (data: any) => void) =>
    ipcRenderer.on(channel, (_event, data) => listener(data)),
  removeListener: (channel: string, listener: (data: any) => void) =>
    ipcRenderer.removeListener(channel, listener),
  openUrl: (url) => ipcRenderer.send('open-url', url),
  ipcRenderer: {
    on: (channel, func) => {
      ipcRenderer.on(channel, func);
    },
    removeAllListeners: (channel) => {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  
  // Authentication manager
  getAuth: async () => ipcRenderer.invoke('getAuth'),
  setAuth: (auth: any) => ipcRenderer.send('setAuth', auth),
  clearTokens: () => ipcRenderer.send('clear-tokens'),
} satisfies Window['electron']);

export const ipcInvoke = (channel: string, ...args: any[]): Promise<any> => {
  return ipcRenderer.invoke(channel, ...args);
};

export function ipcOn<Key extends keyof EventPayloadMapping>(key: Key, callback: (payload: EventPayloadMapping[Key]) => void) {
  const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload); 
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}
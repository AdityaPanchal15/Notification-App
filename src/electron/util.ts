import { app, BrowserWindow, ipcMain, WebContents, WebFrameMain } from 'electron';
import { getUIPath } from './pathResolver.js';
import { pathToFileURL } from 'node:url';

export function isDev(): boolean {
  return process.env.NODE_ENV === "development";
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping, Return = void>(
  key: Key,
  handler: (args: EventPayloadMapping[Key]) => Return | Promise<Return>
) {
  ipcMain.handle(key, async (event, args) => {
    validateEventFrame(event.senderFrame);
    return handler(args);
  });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(key: Key, webContents: WebContents, payload: EventPayloadMapping[Key]) {
  webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain | null) {
  if (!frame) throw new Error('Missing frame');

  const url = frame.url;

  if (isDev()) {
    if (new URL(url).host === 'localhost:5123') return;
  }

  // In production, check that it's loading your built index.html
  if (!url.startsWith('file://') || !url.includes('dist-react/index.html')) {
    console.warn('Blocked IPC from:', url);
    throw new Error('Malicious event');
  }
}


export function handleCloseEvents(mainWindow?: BrowserWindow | null) {
  let willClose = false;
  mainWindow?.on('close', (e) => {
    if(willClose) {
      return;
    }
    e.preventDefault();
    mainWindow.hide();
    if(app.dock) {
      app.dock.hide();
    }
  });
  
  app.on("before-quit", () => {
    willClose = true;
  })
  
  mainWindow?.on("show", () => {
    willClose = false;
  })
}
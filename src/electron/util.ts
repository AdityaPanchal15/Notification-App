import { ipcMain, WebContents, WebFrameMain } from 'electron';
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

  if(isDev() && frame && new URL(frame.url).host === 'localhost:5123') {
    return;
  }
  if(frame && frame.url !== pathToFileURL(getUIPath()).toString()) {
    throw new Error('Malicious event');
  }
}
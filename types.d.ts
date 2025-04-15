type EventPayloadMapping = {
  changeView: View;
  storeNotification: { res: any, title: string; body: string };
  getNotifications: void;
  deleteNotification: { notificationIndex: number };
  getAuthStatus: boolean;
}

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    ipcRenderer: {
      on: (channel: string, listener: (event: any, data: any) => void) => void;
      removeAllListeners: (channel: string) => void;
    };

    // onBroadcastMessage: (callback: (msg: { title: string; body: string }) => void) => void;
    // sendBroadcastMessage: (message: string) => Promise<void>;
    
    showNotification: (title: string, body: string, icon?: string) => void;
    deleteNotification: (notificationId: number) => void;
    getNotifications: () => Promise<any[]>;
    on: (channel: string, listener: (data: any) => void) => void;
    removeListener: (channel: string, listener: (data: any) => void) => void;
    // Add openUrl for your specific need
    openUrl: (url: string) => void;
    getAuthStatus: () => Promise<boolean>;
    storeTokens: (accessToken: string, refreshToken: string) => void;
    clearTokens: () => void;
  }
}
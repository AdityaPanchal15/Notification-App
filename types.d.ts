type Statistics = {
  cpuUsage: number;
  ramUsage: number; 
  storageUsage: number; 
}

type StaticData = {
  totalStorage: number;
  cpuModel: string;
  totalMemoryGB: number;
}

type View = 'CPU' | 'RAM' | 'STORAGE';

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: StaticData;
  changeView: View;
  broadcastMessage: { title: string; body: string }; 
  storeNotification: { res: any, title: string; body: string };
  getNotifications: void;
  deleteNotification: { notificationIndex: number };
}

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeChangeView: (callback: (view: View) => void) => UnsubscribeFunction;
    
    onBroadcastMessage: (callback: (msg: { title: string; body: string }) => void) => void;
    sendBroadcastMessage: (message: string) => Promise<void>;
    
    showNotification: (title: string, body: string, icon?: string) => void;
    deleteNotification: (notificationId: number) => void;
    getNotifications: () => Promise<any[]>;
    on: (channel: string, listener: (data: any) => void) => void;
    removeListener: (channel: string, listener: (data: any) => void) => void;
    // Add openUrl for your specific need
    openUrl: (url: string) => void;
  }
}
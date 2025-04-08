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
}

type UnsubscribeFunction = () => void;

interface Window {
  electron: {
    subscribeStatics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
    getStaticData: () => Promise<StaticData>;
    subscribeChangeView: (callback: (view: View) => void) => UnsubscribeFunction;
    
    onBroadcastMessage: (callback: (msg: { title: string; body: string }) => void) => void;
    sendBroadcastMessage: (message: string) => Promise<void>;
    
    showNotification: (title: string, body: string, icon?: string) => void
  }
}
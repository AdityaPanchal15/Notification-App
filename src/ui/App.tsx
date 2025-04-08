// App.tsx
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    let socket: WebSocket;
  
    const connectWebSocket = () => {
      socket = new WebSocket("https://45db-180-211-118-54.ngrok-free.app");
  
      socket.onopen = () => {
        console.log("WebSocket connected");
      };
  
      socket.onmessage = (event) => {
        const { title, body } = JSON.parse(event.data);
        window.electron.showNotification(title, body);
      };
  
      socket.onclose = () => {
        console.log("WebSocket closed. Reconnecting in 2s...");
        setTimeout(connectWebSocket, 2000); // reconnect on disconnect
      };
  
      socket.onerror = (err) => {
        console.error("WebSocket error:", err);
        socket.close();
      };
    };
  
    connectWebSocket();
  
    return () => {
      if (socket) socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Electron + React WebSocket Notifications</h1>
    </div>
  );
};

export default App;

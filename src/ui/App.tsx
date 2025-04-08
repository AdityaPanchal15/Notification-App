import React, { useEffect, useState } from "react";
import { messaging, getToken, onMessage } from "../../firebase";

const App = () => {
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        getToken(messaging, {
          vapidKey:"BHjqGZ_VOIiL8J_eP0d0ItBM6QaMT-CPU_deVlrylndYviHOt14BnAvEet0PajIujAj4GI2Wf7hXFvI9WSHdNK8"
        }).then((token: string) => {
          if (token) {
            console.log("FCM Token:", token);
            setToken(token);
            // 👉 Send token to backend to store/send push
          } else {
            console.log("No token found");
          }
        });
      }
    });

    onMessage(messaging, (payload: any) => {
      console.log("Foreground push received: ", payload);
      const { title, body } = payload.notification!;
      // new Notification(title, { body });
      window.electron.showNotification(title, body);
    });
  }, []);

  // useEffect(() => {
  //   window.electron.onBroadcastMessage((msg: any) => {
  //     window.electron.showNotification(msg.title, msg.body);
  //   });
  // }, []);
  
  // const sendNotification = async () => {
  //   if(!token) {
  //     alert('Token not found!');
  //     return;
  //   }
  //   await fetch("http://localhost:3000/send", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       token,
  //       title: "Broadcast Title",
  //       body: "Message from Electron + React!",
  //       icon: "https://placehold.co/400",
  //     }),
  //   });
  //   // window.electron.showNotification(
  //   //   "Notification App",
  //   //   message,
  //   //   // "assets/trayIcon.png" // optional
  //   // );
    
  // }

  return (
    <div>
      <div>React + Electron + FCM Notification Setup</div>
      {/* <input type='input' value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendNotification}>Send Notification</button> */}
    </div>
  );
};

export default App;

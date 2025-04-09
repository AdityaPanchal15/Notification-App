import { useEffect, useState } from "react";
import './popup.css';
import { createRoot } from "react-dom/client";

type NotificationItem = {
  title: string;
  body: any;
  timestamp: number;
};

const Popup = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    // Load past notifications
    window.electron.getNotifications().then(setNotifications);

    // Listen for new ones
    const listener = (data: NotificationItem) => {
      setNotifications(prev => [data, ...prev]);
    };
    window.electron.on("new-notification", listener);

    return () => {
      window.electron.removeListener("new-notification", listener);
    };
  }, []);
  
  const deleteNotification = (notificationIndex: number) => {
    window.electron.deleteNotification(notificationIndex);
    setNotifications((prevState) => prevState.filter((_, index) => notificationIndex !== index));
  }

  return (
    <div className="popup-wrapper">
    <h2 className="popup-title">🔔 Notifications</h2>
      {notifications.length === 0 ? (
    <div className="no-notifications">No notifications yet.</div>
    ) : (
      <ul className="notification-list">
        {notifications.map((n, i) => (
          <li key={i} className="notification-card">
            {n.body.image && (
              <div className="notification-image">
                <img src={n.body.image} alt="notification visual" />
              </div>
            )}
            <div className="notification-content">
              <div className="notification-icon">
                {n.body.icon ? (
                  <img src={n.body.icon} alt="icon" />
                ) : (
                  <span>📩</span>
                )}
              </div>
              <div className="notification-text">
                <div className="notification-title">{n.title}</div>
                <div className="notification-body">{n.body.message}</div>
              </div>
              <button className="delete-button" onClick={() => deleteNotification(i)}>✖</button>
            </div>
            <div className="notification-time">
              {new Date(n.timestamp).toLocaleTimeString()}
            </div>
          </li>
        ))}
      </ul>
    )}

  </div>
  
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);

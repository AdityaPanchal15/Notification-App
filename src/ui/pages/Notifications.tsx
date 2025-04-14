import { useState, useEffect } from 'react';

type NotificationItem = {
  title: string;
  body: any;
  timestamp: number;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  // const [collapse, setcollapse] = useState<boolean>(false);

  useEffect(() => {
    // Load past notifications
    window.electron.getNotifications().then(setNotifications);

    // Listen for new ones
    const listener = (data: NotificationItem) => {
      setNotifications((prev) => [data, ...prev]);
    };
    window.electron.on("new-notification", listener);

    return () => {
      window.electron.removeListener("new-notification", listener);
    };
  }, []);

  // const deleteNotification = (e: any, notificationIndex: number = -1) => {
  //   e.stopPropagation();
  //   window.electron.deleteNotification(notificationIndex);

  //   if (notificationIndex == -1) {
  //     setNotifications([]);
  //     return;
  //   }
  //   setNotifications((prevState) =>
  //     prevState.filter((_, index) => notificationIndex !== index)
  //   );
  // };

  // const handleClick = (url: string) => {
  //   window.electron.openUrl(url);
  // };

  return (
    <div className="notification-container">
      <h2>Notifications</h2>
      {!notifications.length && <p>No new notifications</p>}
      {notifications.map((n, index) => (
        <div key={index} className="notification-card">
          <img src={n.body.image} alt="news" className="notification-image" />
          <div className="notification-content">
            <div className="notification-header">
              {/* <img src={n.body.icon} alt="icon" className="notification-icon" /> */}
              <div>
                <h2 className="notification-title">{n.title}</h2>
                <p className="notification-message">{n.body.message}</p>
              </div>
            </div>
            <div className="notification-footer">
              <span className="notification-time">
                {new Date(n.timestamp).toLocaleString()}
              </span>
              <a href={n.body.url} target="_blank" rel="noopener noreferrer" className="notification-link">
                Read More →
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

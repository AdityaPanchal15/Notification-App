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

  const deleteNotification = (notificationIndex: number = -1) => {
    window.electron.deleteNotification(notificationIndex);

    if (notificationIndex == -1) {
      setNotifications([]);
      return;
    }
    setNotifications((prevState) =>
      prevState.filter((_, index) => notificationIndex !== index)
    );
  };

  const handleClick = (url: string) => {
    window.electron.openUrl(url);
  };

  return (
    <div className="notification-container">
      <h4>My Notifications {notifications.length ? `(${notifications.length})` : ""}</h4>
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
              <button type='button' className="delete-btn btn btn-link" onClick={() => deleteNotification(index)}>
                <i className="bi bi-trash"></i> Delete
              </button>
              <span className='mark-read-btn'>
                <i className="bi bi-check2-all"></i> Mark as read
              </span>
              <button type='button' className="notification-link btn btn-link" onClick={() => handleClick(n.body.url)}>
                Read More →
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

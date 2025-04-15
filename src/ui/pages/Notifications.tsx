import { useState, useEffect } from 'react';

type NotificationItem = {
  title: string;
  body: any;
  app: any;
  timestamp: number;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isGroupedNotification, setIsGroupNotification] = useState(false);
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
      <div className='d-flex align-items-center justify-content-between'>
        <h4 className='my-3'>My Notifications {notifications.length ? `(${notifications.length})` : ""}</h4>
        <div className='d-flex'>
          <label className="form-check-label me-2" htmlFor="isGroupCheckbox">
            Group Notification by App
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="isGroupCheckbox"
              checked={isGroupedNotification}
              onChange={() => setIsGroupNotification(!isGroupedNotification)}
            />
          </div>
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Message</th>
            <th>Data Received</th>
            <th>Client App</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {notifications.length ? notifications.map((n, index) => (
            <tr key={index}>
              <td><img src={n.body.image} alt="news" className="notification-image" /></td>
              <td>{n.title}</td>
              <td>{n.body.message}</td>
              <td>{new Date(n.timestamp).toLocaleString()}</td>
              <td>{n.app?.label}</td>
              <td>
                <button type='button' className="delete-btn btn btn-link" onClick={() => handleClick(n.body.url)}>
                  <i className="bi bi-box-arrow-up-right"></i> Open
                </button> |
                <button type='button' className="delete-btn btn btn-link" onClick={() => deleteNotification(index)}>
                  <i className="bi bi-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))
            : (<tr><td colSpan={6}>No new notifications</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from "react";
import './popup.css';
import { createRoot } from "react-dom/client";
import Aero from "../assets/aero.svg";

type NotificationItem = {
  title: string;
  body: any;
  timestamp: number;
};

const Popup = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [collapse, setcollapse] = useState<boolean>(false);

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

  const deleteNotification = (e: any, notificationIndex: number = -1) => {
    e.stopPropagation();
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
    <div className="popup-wrapper">
      {notifications.length === 0 ? (
        <div className="no-notifications">No new notifications</div>
      ) : (
        <>
          <div className="d-flex align-items-center justify-content-between bg-white sticky-top">
            <h2 className="popup-title">
              Notifications{" "}
              {notifications.length ? `(${notifications.length})` : ""}
            </h2>

            <button
              className="close-all"
              onClick={(e) => deleteNotification(e)}
            >
              Clear all
            </button>
          </div>
          <ul className="notification-list">
            {notifications.map((n, i) => (
              <li
                key={i}
                className="notification-card"
                onClick={() => handleClick(n.body.url)}
              >
                {n.body.image && (
                  <div className="notification-image">
                    <img src={n.body.image} alt="notification visual" />
                  </div>
                )}
                <div className="notification-content">
                  <button
                    className="delete-button"
                    onClick={(e) => deleteNotification(e, i)}
                  >
                    ✖
                  </button>
                  <div className="notification-icon">
                    {n.body.icon ? (
                      <img src={n.body.icon} alt="icon" />
                    ) : (
                      <span>📩</span>
                    )}
                  </div>

                  <div className="notification-text">
                    <div className="notification-title">{n.title}</div>
                    <div className="d-flex align-items-start">
                      <div
                        className={`notification-body ${
                          collapse ? "active" : ""
                        }`}
                      >
                        {n.body.message}
                      </div>
                      <button
                        className="arrow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setcollapse(!collapse);
                        }}
                      >
                        <img src={Aero} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="notification-time">
                  {new Date(n.timestamp).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
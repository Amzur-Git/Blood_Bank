import React from 'react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { removeNotification } from '../../store/slices/notificationSlice';

const NotificationContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications } = useAppSelector((state) => state.notifications);

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <span className="notification-icon notification-icon-success">✅</span>;
      case 'error':
        return <span className="notification-icon notification-icon-error">❌</span>;
      case 'warning':
        return <span className="notification-icon notification-icon-warning">⚠️</span>;
      case 'critical':
        return <span className="notification-icon notification-icon-critical">🚨</span>;
      default:
        return <span className="notification-icon notification-icon-info">ℹ️</span>;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'notification notification-success';
      case 'error':
        return 'notification notification-error';
      case 'warning':
        return 'notification notification-warning';
      case 'critical':
        return 'notification notification-critical';
      default:
        return 'notification notification-info';
    }
  };

  return (
    <div className="notification-container">
      {notifications.slice(0, 5).map((notification) => (
        <div
          key={notification.id}
          className={getNotificationClass(notification.type)}
        >
          <div className="notification-content">
            <div className="flex items-start gap-md">
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <p className="notification-title">
                  {notification.title}
                </p>
                <p className="notification-message">
                  {notification.message}
                </p>
              </div>
              <button
                className="notification-close"
                onClick={() => handleRemove(notification.id)}
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;

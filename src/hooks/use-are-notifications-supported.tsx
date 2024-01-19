'use client';
import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if notifications are supported.
 * @returns boolean indicating whether notifications are supported.
 */
export const useAreNotificationsSupported = () => {
  const [areNotificationsSupported, setAreNotificationsSupported] = useState(false);

  useEffect(() => {
    const areNotificationsSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setAreNotificationsSupported(areNotificationsSupported);
  }, []);

  return areNotificationsSupported;
};

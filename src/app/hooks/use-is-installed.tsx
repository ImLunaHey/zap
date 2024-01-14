'use client';
import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if the app is installed.
 * @returns boolean indicating whether the app is installed.
 */
export const useIsInstalled = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isInstalled = localStorage.getItem('isInstalled') === 'true';
    setIsInstalled(isInstalled);
  }, []);

  return isInstalled;
};

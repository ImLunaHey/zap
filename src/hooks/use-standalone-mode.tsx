'use client';
import { useEffect, useState } from 'react';

/**
 * Custom hook to determine if a PWA is running in standalone mode.
 * @returns boolean indicating whether the PWA is in standalone mode.
 */
export const useStandaloneMode = (): boolean => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkDisplayMode = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      setIsStandalone(isStandaloneMode);
    };

    // Check the display mode immediately and also on app visibility change
    checkDisplayMode();
    document.addEventListener('visibilitychange', checkDisplayMode);

    // Cleanup the event listener when the component unmounts
    return () => document.removeEventListener('visibilitychange', checkDisplayMode);
  }, []);

  return isStandalone;
};

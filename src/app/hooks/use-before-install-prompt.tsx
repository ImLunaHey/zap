'use client';
import { useEffect, useState } from 'react';
import { BeforeInstallPromptEvent } from '../components/add-to-homescreen-button';

/**
 * Custom hook to handle the beforeinstallprompt event.
 * @returns The beforeinstallprompt event if it is fired, otherwise null.
 */
export const useBeforeInstallPrompt = (): BeforeInstallPromptEvent | null => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return deferredPrompt;
};

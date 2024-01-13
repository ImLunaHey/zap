'use client';
import { useEffect, useState } from 'react';

// Source: https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Source: https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export const AddToHomeScreenButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', (e) => handleBeforeInstallPrompt(e));

    setTimeout(() => {
      if (deferredPrompt) {
        alert('deferred prompt found');
      }
    }, 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleClick = () => {
    // Show the install prompt
    deferredPrompt?.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt?.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setDeferredPrompt(null);
    });
  };

  return deferredPrompt ? <button onClick={handleClick}>Add to Home Screen</button> : null;
};

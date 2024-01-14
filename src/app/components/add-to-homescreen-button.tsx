'use client';
import { ButtonHTMLAttributes, useEffect, useState } from 'react';
import { Notifications } from './notifications';

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

/**
 * Custom hook to determine if a PWA is running in standalone mode.
 * @returns boolean indicating whether the PWA is in standalone mode.
 */
const useStandaloneMode = (): boolean => {
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

/**
 * Custom hook to handle the beforeinstallprompt event.
 * @returns A tuple containing the deferred prompt and a function to trigger it.
 */
const useBeforeInstallPrompt = (): BeforeInstallPromptEvent | null => {
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

const useFakeLoading = (duration: number) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  return isLoading;
};

const useIsInstalled = () => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isInstalled = localStorage.getItem('isInstalled') === 'true';
    setIsInstalled(isInstalled);
  }, []);

  return isInstalled;
};

const useAreNotificationsSupported = () => {
  const [areNotificationsSupported, setAreNotificationsSupported] = useState(false);

  useEffect(() => {
    const areNotificationsSupported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
    setAreNotificationsSupported(areNotificationsSupported);
  }, []);

  return areNotificationsSupported;
};

export default function AddToHomeScreenButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const isStandalone = useStandaloneMode();
  const deferredPrompt = useBeforeInstallPrompt();
  const isLoading = useFakeLoading(100);
  const isInstalled = useIsInstalled();
  const areNotificationsSupported = useAreNotificationsSupported();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  // If the app is already installed, show the enable notifications button
  if (isStandalone) {
    return <Notifications />;
  }

  // If the app is already installed, tell the user to open the app on their homescreen
  if (isInstalled) {
    return <p>Please open the app on your homescreen.</p>;
  }

  // If this browser doesn't support notifications, tell the user to use a different browser
  if (!areNotificationsSupported) {
    return <p>{"This browser doesn't support notifications. Please use a different browser to install this app."}</p>;
  }

  // If this browser doesn't support installing PWAs, tell the user to use a different browser
  if (!deferredPrompt) {
    return <p>{"This browser doesn't support installing PWAs. Please use a different browser to install this app."}</p>;
  }

  // If all is well, show the install button
  return (
    <button
      onClick={() => {
        // Show the install prompt
        deferredPrompt?.prompt();

        // Wait for the user to respond to the prompt
        deferredPrompt?.userChoice.then((choiceResult) => {
          localStorage.setItem('isInstalled', choiceResult.outcome === 'accepted' ? 'true' : 'false');
        });
      }}
      {...props}
    >
      Install app
    </button>
  );
}

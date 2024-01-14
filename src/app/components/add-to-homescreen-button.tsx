'use client';

import { ButtonHTMLAttributes } from 'react';
import { Notifications } from './notifications';
import { useAreNotificationsSupported } from '../hooks/use-are-notifications-supported';
import { useIsInstalled } from '../hooks/use-is-installed';
import { useFakeLoading } from '../hooks/use-fake-loading';
import { useBeforeInstallPrompt } from '../hooks/use-before-install-prompt';
import { useStandaloneMode } from '../hooks/use-standalone-mode';

// Source: https://stackoverflow.com/questions/51503754/typescript-type-beforeinstallpromptevent
export interface BeforeInstallPromptEvent extends Event {
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

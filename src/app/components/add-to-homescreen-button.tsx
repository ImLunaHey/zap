'use client';
import { ButtonHTMLAttributes, HtmlHTMLAttributes, useEffect, useState } from 'react';

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

export const AddToHomeScreenButton = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', (e) => handleBeforeInstallPrompt(e));

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deferredPrompt]);

  const handleClick = () => {
    // Show the install prompt
    deferredPrompt?.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt?.userChoice.then((choiceResult) => {
      setIsInstalled(choiceResult.outcome === 'accepted');
    });
  };

  // If the app is already installed, don't show the button
  if (isInstalled) {
    return <p>The app is installed, please open it from your home screen</p>;
  }

  // If the user is using an unsupported browser, show a warning
  if (!deferredPrompt) {
    return <p>Please use Chrome or Safari to install this app</p>;
  }

  // Otherwise, show the button
  return (
    <button onClick={handleClick} {...props}>
      Install app
    </button>
  );
};

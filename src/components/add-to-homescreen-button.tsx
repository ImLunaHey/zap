'use client';

import { ButtonHTMLAttributes } from 'react';
import { Notifications } from './notifications';
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

const ShareIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" enable-background="new 0 0 50 50" className={className}>
    <path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z" />
    <path d="M24 7h2v21h-2z" />
    <path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z" />
  </svg>
);

export default function AddToHomeScreenButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const isStandalone = useStandaloneMode();
  const deferredPrompt = useBeforeInstallPrompt();
  const isLoading = useFakeLoading(1_000);
  const isInstalled = useIsInstalled();

  // If the app is already installed, show nothing
  if (isStandalone) {
    return null;
  }

  // If the app is already installed, tell the user to open the app on their homescreen
  if (isInstalled) {
    return <p>Please open the app on your homescreen.</p>;
  }

  // Prevent an error showing while we check if this browser supports notifications and PWAs
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // If this browser doesn't support installing PWAs, tell the user to use a different browser
  if (!deferredPrompt) {
    // If this is iOS tell the user to manually add the app to their homescreen
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return (
        <p>
          To install this app, tap the <ShareIcon className="inline-block align-middle w-6 h-6 fill-white" /> button and then
          tap <strong>Add to Homescreen</strong>.
        </p>
      );
    }

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

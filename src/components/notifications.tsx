'use client';

import { PUBLIC_KEY } from '@/config';
import { useAreNotificationsSupported } from '../hooks/use-are-notifications-supported';
import { useLocalStorage } from '@uidotdev/usehooks';

export function Notifications() {
  const [id, setId] = useLocalStorage<string | null>('subscriptionId', null);
  const areNotificationsSupported = useAreNotificationsSupported();
  const [_isSetup, setIsSetup] = useLocalStorage('isSetup', false);

  if (!areNotificationsSupported) {
    return <p>Notifications are not supported on this device.</p>;
  }

  if (!id) {
    return (
      <div>
        <h3>Zap</h3>
        <button
          onClick={async () => {
            const subscriptionId = await subscribe();
            setId(subscriptionId ?? null);
            setIsSetup(true);
          }}
        >
          Subscribe
        </button>
      </div>
    );
  }

  return (
    <div>
      <h3>Zap</h3>
      <p>
        Your ID is <code>{id}</code>, you can send this to your friends so they can zap you!
      </p>
      <button
        onClick={() => {
          unsubscribe();
          setId(null);
        }}
      >
        Unsubscribe
      </button>
    </div>
  );
}

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

const registerServiceWorker = async () => {
  navigator.serviceWorker.register('/service.js');
  return navigator.serviceWorker.ready;
};

const subscribe = async () => {
  await unregisterServiceWorkers();
  const swRegistration = await registerServiceWorker();
  const permission = await window?.Notification.requestPermission();

  // If the user denied permission, throw an error
  if (permission !== 'granted') {
    alert('You must grant permission to receive push notifications!');
    return;
  }

  // If the user granted permission, set up push notifications
  alert('Setting up push notifications...');

  try {
    const options = {
      applicationServerKey: PUBLIC_KEY,
      userVisibleOnly: true,
    };
    const subscription = await swRegistration.pushManager.subscribe(options);
    const result = await saveSubscription(subscription);

    // If the subscription was unsuccessful, throw an error
    if ('error' in result) throw new Error(result.error);

    // Save their subscription ID locally so they can send it to friends
    localStorage.setItem('subscriptionId', result.subscriptionId);

    alert('You are now subscribed to push notifications!');

    return result.subscriptionId;
  } catch (err) {
    console.error('Error', err);
  }
};

const unsubscribe = async () => {
  // Remove old service worker
  await unregisterServiceWorkers();

  // Register a new service worker
  const swRegistration = await registerServiceWorker();
  const subscription = await swRegistration.pushManager.getSubscription();

  // Unsubscribe from push notifications
  await subscription?.unsubscribe();

  // Remove their subscription ID from localStorage
  localStorage.removeItem('subscriptionId');

  // Tell them they've been unsubscribed
  alert('You are now unsubscribed from push notifications!');
};

const saveSubscription = async (subscription: PushSubscription) => {
  const ORIGIN = window.location.origin;
  const BACKEND_URL = `${ORIGIN}/api/subscription`;

  const response = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(subscription),
  });
  return response.json() as Promise<
    | {
        subscriptionId: string;
        message: string;
      }
    | {
        error: string;
      }
  >;
};

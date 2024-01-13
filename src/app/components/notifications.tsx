'use client';

import { PUBLIC_KEY } from '@/config';
import { useState } from 'react';

const notificationsSupported = () => 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;

export default function Notifications() {
  const [id, setId] = useState<string | null>(localStorage.getItem('subscriptionId') ?? null);

  // If the user's browser doesn't support notifications, don't show anything
  if (!notificationsSupported()) {
    return null;
  }

  if (!id) {
    return (
      <div>
        <h3>Zap</h3>
        <button
          onClick={async () => {
            const subscriptionId = await subscribe();
            setId(subscriptionId ?? null);
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
      <button onClick={unsubscribe}>Unsubscribe</button>
    </div>
  );
}

export const unregisterServiceWorkers = async () => {
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));
};

const registerServiceWorker = async () => {
  return navigator.serviceWorker.register('/service.js');
};

const subscribe = async () => {
  await unregisterServiceWorkers();

  const swRegistration = await registerServiceWorker();
  await window?.Notification.requestPermission();

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
  await unregisterServiceWorkers();

  const swRegistration = await registerServiceWorker();
  const subscription = await swRegistration.pushManager.getSubscription();

  if (!subscription) {
    alert('You are not subscribed to push notifications!');
    return;
  }

  const result = await subscription.unsubscribe();
  if (result) {
    localStorage.removeItem('subscriptionId');
    alert('You are now unsubscribed from push notifications!');
  }
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

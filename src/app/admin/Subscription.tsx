'use client';
import { type SubscriptionWithId } from '../redis';

export const Subscription = (subscription: SubscriptionWithId) => (
  <div key={subscription.id}>
    <p>{subscription.id}</p>
    <button
      onClick={() => {
        fetch('/api/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: subscription.id,
            title: 'Test',
            body: 'Test',
          }),
        });
      }}
    >
      Send
    </button>
  </div>
);

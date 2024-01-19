'use server';

import { handleErrors } from '@/handle-errors';
import { HttpError } from '@/http-error';
import { getSubscription } from '@/redis';
import webpush from 'web-push';

const payload = JSON.stringify({
  title: 'Zap ⚡️',
  body: 'Someone wants your attention!',
});

export async function POST(request: Request) {
  return handleErrors(async () => {
    // Validate the request's body.
    const subscriptionId = await request
      .json()
      .then((data) => data as { id: string } | null)
      .then((data) => data?.id);
    if (!subscriptionId) throw new HttpError('No subscription ID was provided!', 400);

    // Get the subscription from Redis.
    const subscription = await getSubscription(subscriptionId);
    if (!subscription) throw new HttpError('No subscription was found!', 404);

    // Send the notification.
    await webpush.sendNotification(subscription, payload);
  })(request);
}

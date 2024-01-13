'use server';

import { getSubscription } from '@/app/redis';
import webpush from 'web-push';

const payload = JSON.stringify({
  title: 'Zap ⚡️',
  body: 'Someone wants your attention!',
});

export async function POST(request: Request) {
  try {
    const subscriptionId = await request
      .json()
      .then((data) => data as { id: string } | null)
      .then((data) => data?.id);

    if (!subscriptionId) throw new Error('No subscription ID was provided!');

    const subscription = await getSubscription(subscriptionId);
    if (!subscription) throw new Error('No subscription was found!');

    const response = await webpush.sendNotification(subscription, payload);

    console.log(response);

    return Response.json({ subscriptionId, message: 'Zap sent!' });
  } catch (error) {
    if (!(error instanceof Error))
      throw new Error('Unknown error', {
        cause: error,
      });

    return Response.json({
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }
}

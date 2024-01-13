'use server';
import webpush, { type PushSubscription } from 'web-push';
import { PRIVATE_KEY, PUBLIC_KEY } from '@/config';
import { getSubscriptions, saveSubscription } from '@/app/redis';

webpush.setVapidDetails('https://github.com/imlunahey/zap', PUBLIC_KEY, PRIVATE_KEY);

export async function POST(request: Request) {
  try {
    const subscription = (await request.json()) as PushSubscription | null;

    if (!subscription) {
      console.error('No subscription was provided!');
      return;
    }

    const subscriptionId = await saveSubscription(subscription);

    return Response.json({ subscriptionId, message: 'Subscription saved!' });
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

export async function GET() {
  try {
    const subscriptions = await getSubscriptions();

    for (const subscription of subscriptions) {
      const payload = JSON.stringify({
        title: 'Zap ⚡️',
        body: 'Someone wants your attention!',
      });
      webpush.sendNotification(subscription, payload);
    }

    return Response.json({
      message: 'Push notifications sent!',
    });
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

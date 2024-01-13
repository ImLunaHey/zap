'use server';
import webpush, { type PushSubscription } from 'web-push';
import { PRIVATE_KEY, PUBLIC_KEY } from '@/config';
import { getSubscriptions, saveSubscription } from '@/app/redis';

webpush.setVapidDetails('https://github.com/imlunahey/zap', PUBLIC_KEY, PRIVATE_KEY);

export async function POST(request: Request) {
  try {
    const subscription = (await request.json()) as PushSubscription | null;

    console.log({ subscription });

    if (!subscription) {
      console.error('No subscription was provided!');
      return;
    }

    await saveSubscription(subscription);

    return Response.json({ message: 'success' });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'error' });
  }
}

export async function GET() {
  try {
    const subscriptions = await getSubscriptions();

    for (const subscription of subscriptions) {
      const payload = JSON.stringify({
        title: 'WebPush Notification!',
        body: 'Hello World',
      });
      webpush.sendNotification(subscription, payload);
    }

    return Response.json({
      message: `${subscriptions.length} messages sent!`,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: 'error' });
  }
}

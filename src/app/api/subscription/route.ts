'use server';
import { type PushSubscription } from 'web-push';
import { saveSubscription } from '@/app/redis';

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

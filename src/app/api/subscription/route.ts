'use server';
import { type PushSubscription } from 'web-push';
import { saveSubscription } from '@/redis';
import { HttpError } from '@/http-error';
import { handleErrors } from '@/handle-errors';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  return handleErrors(async () => {
    // Validate the request's body.
    const subscription = await request
      .json()
      .then((data) => data as PushSubscription | null)
      .then((data) => data);
    if (!subscription) throw new HttpError('No subscription was provided!', 400);

    // Save the subscription to Redis.
    const subscriptionId = await saveSubscription(subscription);

    // Set a cookie with the subscription's ID.
    cookies().set('subscriptionId', subscriptionId);
  })(request);
}

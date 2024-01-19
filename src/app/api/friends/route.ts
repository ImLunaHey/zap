'use server';

import { handleErrors } from '@/handle-errors';
import { addFriend, getFriends } from '@/redis';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  return handleErrors(async () => {
    // Get the user's ID from the request's cookies.
    const userId = cookies().get('subscriptionId')?.value;
    if (!userId) throw new Error('No user ID was provided!');

    // Get the user's friends from Redis.
    const friends = await getFriends(userId);
    return new Response(JSON.stringify(friends), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  })(request);
}

export async function POST(request: Request) {
  return handleErrors(async () => {
    // Validate the request's body.
    const body = await request
      .json()
      .then((data) => data as { id: string } | null)
      .then((data) => data);
    if (!body) throw new Error('No subscription ID was provided!');

    // Get the user's ID from the request's cookies.
    const userId = cookies().get('subscriptionId')?.value;
    if (!userId) throw new Error('No user ID was provided!');

    // Save the subscription to Redis.
    await addFriend(userId, body.id);
  })(request);
}

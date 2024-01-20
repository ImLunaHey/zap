import webpush, { PushSubscription } from 'web-push';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';
import { PRIVATE_KEY, PUBLIC_KEY } from '@/config';

export type SubscriptionWithId = PushSubscription & { id: string };

const redis = new Redis({
  url: 'https://usw2-firm-bluebird-30642.upstash.io',
  token: process.env.REDIS_TOKEN!,
});

export const saveSubscription = async (subscription: PushSubscription) => {
  const id = randomUUID();
  await redis.set(id, JSON.stringify(subscription));
  return id;
};

export const getSubscriptions = async () => {
  const keys = await redis.keys('*');
  if (keys.length === 0) return [];
  const subscriptions = (await redis.mget<string[]>(...keys)) as unknown as PushSubscription[];
  return subscriptions.map(
    (subscription, index) =>
      ({
        id: keys[index],
        ...subscription,
      } as SubscriptionWithId),
  );
};

export const getSubscription = async (id: string) => {
  const subscription = (await redis.get(id)) as unknown as PushSubscription | null;
  if (!subscription) return null;
  return {
    id,
    ...subscription,
  } as SubscriptionWithId;
};

export const addFriend = async (id: string, friendId: string) => {
  await redis.sadd(`${id}/friends`, friendId);
};

export const getFriends = async (id: string) => {
  return (await redis.smembers(`${id}/friends`)) as string[];
};

export const deleteFriend = async (id: string, friendId: string) => {
  await redis.srem(`${id}/friends`, friendId);
};

// Setup webpush
webpush.setVapidDetails('https://github.com/imlunahey/zap', PUBLIC_KEY, PRIVATE_KEY);

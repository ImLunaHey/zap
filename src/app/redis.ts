import { PushSubscription } from 'web-push';
import { Redis } from '@upstash/redis';
import { randomUUID } from 'crypto';

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
  return (await redis.mget<string[]>(...keys)) as unknown as PushSubscription[];
};

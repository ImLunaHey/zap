import { QueryClient, UseMutationOptions, useMutation } from '@tanstack/react-query';

const sendNotification = async (id: string) => {
  const response = await fetch('/api/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      title: 'Test',
      body: 'Test',
    }),
  });

  return await response.json();
};

type Context = { id: string };

export const useSendNotification = (
  options: UseMutationOptions<Response, Error, Context, () => Context>,
  queryClient?: QueryClient | undefined,
) => {
  return useMutation<Response, Error, Context, () => Context>(
    {
      ...options,
      mutationKey: ['sendNotification'],
      mutationFn: async ({ id }) => sendNotification(id),
    },
    queryClient,
  );
};

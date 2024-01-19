import { QueryClient, UseMutationOptions, useMutation } from '@tanstack/react-query';

const addFriend = async (id: string) => {
  const response = await fetch('/api/friends', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
    }),
  });

  // Something went wrong
  if (!response.ok) {
    throw new Error(await response.text());
  }

  // Return the updated list of friends
  return await response.json();
};

type Context = { id: string };

export const useAddFriend = (
  options: UseMutationOptions<Response, Error, Context, () => Context>,
  queryClient?: QueryClient | undefined,
) => {
  return useMutation<Response, Error, Context, () => Context>(
    {
      ...options,
      mutationKey: ['addFriend'],
      mutationFn: async ({ id }) => addFriend(id),
    },
    queryClient,
  );
};

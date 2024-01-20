import { QueryClient, UseMutationOptions, useMutation } from '@tanstack/react-query';

const addFriend = async (id: string) => {
  try {
    console.info('Adding friend', id);
    const response = await fetch('/api/friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
      }),
    });

    console.info('Status code', response.status);

    // Something went wrong
    if (response.status >= 400) {
      throw new Error(await response.text());
    }

    // Successfully added friend
    if (response.status === 204) {
      return null;
    }

    // Return the updated list of friends
    return await response.json();
  } catch (error) {
    console.error('Failed to add friend', error);
    throw error;
  }
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
      mutationFn: async ({ id }) => {
        console.log('id', id);
        return await addFriend(id);
      },
    },
    queryClient,
  );
};

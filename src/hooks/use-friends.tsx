import { QueryClient, UseQueryOptions, useQuery } from '@tanstack/react-query';

const getFriends = async () => {
  try {
    console.info('Fetching friends');
    const response = await fetch('/api/friends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.info('Status code', response.status);

    // Something went wrong
    if (response.status >= 400) {
      throw new Error(await response.text());
    }

    // Return the list of friends
    return (await response.json()) as string[];
  } catch (error) {
    console.error('Failed to add friend', error);
    throw error;
  }
};

export const useFriends = (options: UseQueryOptions<string[]>, queryClient?: QueryClient | undefined) => {
  return useQuery<string[]>(
    {
      ...options,
      queryKey: ['getFriends'],
      queryFn: async () => {
        return await getFriends();
      },
    },
    queryClient,
  );
};

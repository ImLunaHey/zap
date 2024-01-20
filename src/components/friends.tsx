'use client';
import { useState } from 'react';
import { useFriends } from '../hooks/use-friends';
import { Button } from './button';
import { useAddFriend } from '../hooks/use-add-friend';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useSendNotification } from '@/hooks/use-send-notification';
import { Box } from './box';
import { Input } from './input';

export const Friends = () => {
  const subscriptionId = useLocalStorage<string | null>('subscriptionId', null);
  const { data: friends } = useFriends({
    queryKey: subscriptionId,
    enabled: !!subscriptionId,
  });
  const sendNotification = useSendNotification({
    onSuccess: () => {
      alert('Sent');
    },
    onError: () => {
      alert('Error sending notification');
    },
  });
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendId, setNewFriendId] = useState('');
  const addFriend = useAddFriend({
    onSuccess: () => {
      alert('Added');
      window.location.href = '/';
    },
    onError: () => {
      alert('Error adding friend');
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl">Friends</h1>

        {friends?.map((friendId) => (
          <div key={friendId} className="flex flex-row gap-2">
            <Box className="flex flex-row gap-2 p-4">{friendId}</Box>

            <Button
              onClick={() => {
                sendNotification.mutate({ id: friendId });
              }}
            >
              Zap
            </Button>
          </div>
        ))}
      </div>

      {/* Add friend */}
      {showAddFriend && (
        <div className="flex flex-col gap-2">
          <Input
            type="text"
            placeholder="Name"
            value={newFriendName}
            className="p-2"
            onChange={(e) => {
              e.preventDefault();
              setNewFriendName(e.target.value);
            }}
          />
          <Input
            type="text"
            placeholder="Id"
            value={newFriendId}
            className="p-2"
            onChange={(e) => {
              e.preventDefault();
              setNewFriendId(e.target.value);
            }}
          />
          <div className="flex flex-row gap-2">
            <Button
              onClick={() => {
                addFriend.mutate({ id: newFriendId });
              }}
              className="w-full"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setShowAddFriend(false);
              }}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
      {/* Add friend button */}
      {!showAddFriend && (
        <Button
          onClick={() => {
            setShowAddFriend(true);
          }}
        >
          Add Friend
        </Button>
      )}
    </div>
  );
};

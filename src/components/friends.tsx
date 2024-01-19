'use client';
import { useState } from 'react';
import { useFriends } from '../hooks/use-friends';
import { Button } from './button';
import { useAddFriend } from '../hooks/use-add-friend';

export const Friends = () => {
  const friends = useFriends();
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
    <div>
      <h1 className="text-3xl">Friends</h1>
      {/* Click here to add your first friend */}
      {friends.length === 0 && <p className="text-center">Click here to add your first friend</p>}
      {/* Add friend */}
      {showAddFriend && (
        <div className="flex flex-col gap-2 text-black">
          <input
            type="text"
            placeholder="Name"
            value={newFriendName}
            className="p-2"
            onChange={(e) => {
              e.preventDefault();
              setNewFriendName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Id"
            value={newFriendId}
            className="p-2"
            onChange={(e) => {
              e.preventDefault();
              setNewFriendId(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              addFriend.mutate({ id: newFriendId });
            }}
          >
            Add
          </Button>
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
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
    </div>
  );
};

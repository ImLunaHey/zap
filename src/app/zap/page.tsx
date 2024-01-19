'use client';

import { useSendNotification } from '../../hooks/use-send-notification';

export default function Page() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const sendNotification = useSendNotification({
    onSuccess: () => {
      alert('Zapped!');
      window.location.href = '/';
    },
    onError: () => {
      alert('Error zapping');
    },
  });

  // Redirect to home page if no ID is provided
  if (!id) return Response.redirect('/');

  return (
    <main className="p-10 flex gap-2 flex-col">
      <p>Are you sure you want to zap {id}?</p>
      <div className="flex gap-2">
        <button
          className="p-2 border"
          onClick={() => {
            sendNotification.mutate({ id });
          }}
        >
          Yes
        </button>
        <button
          className="p-2 border"
          onClick={() => {
            window.location.href = '/';
          }}
        >
          No
        </button>
      </div>
    </main>
  );
}

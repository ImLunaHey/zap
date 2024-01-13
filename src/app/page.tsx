import dynamic from 'next/dynamic';
import { AddToHomeScreenButton } from '@/app/components/add-to-homescreen/add-to-homescreen-button';

const Notifications = dynamic(() => import('@/app/components/notifications'), {
  ssr: false, // Make sure to render component client side to access window and Notification APIs
});

export default function Home() {
  return (
    <>
      <Notifications />
      <AddToHomeScreenButton />
    </>
  );
}

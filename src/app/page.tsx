import dynamic from 'next/dynamic';

const AddToHomeScreenButton = dynamic(() => import('@/app/components/add-to-homescreen-button'), {
  ssr: false, // Make sure to render component client side to access window and Notification APIs
});

export default function Home() {
  return (
    <main className="flex p-10 ">
      <AddToHomeScreenButton />
    </main>
  );
}

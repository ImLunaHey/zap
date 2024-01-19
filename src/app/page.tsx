import dynamic from 'next/dynamic';

const App = dynamic(() => import('@/components/app'), {
  ssr: false, // Make sure to render component client side to access window and Notification APIs
});

export default function Home() {
  return <App />;
}

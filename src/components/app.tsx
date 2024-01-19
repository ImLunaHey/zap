'use client';
import { useStandaloneMode } from '../hooks/use-standalone-mode';
import { Friends } from './friends';
import { useLocalStorage } from '@uidotdev/usehooks';
import AddToHomeScreenButton from './add-to-homescreen-button';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from './notifications';

const queryClient = new QueryClient();

export default function App() {
  const isStandalone = useStandaloneMode();
  const [isSetup] = useLocalStorage('isSetup', false);

  // Show the install button if the app isn't already installed
  if (!isStandalone) {
    return (
      <main className="flex p-10 ">
        <AddToHomeScreenButton />
      </main>
    );
  }

  // Check if they have run setup yet
  if (!isSetup) {
    return (
      <main className="flex p-10 flex-col gap-2 items-center">
        <p className="text-center">Welcome to Zap!</p>
        <Notifications />
      </main>
    );
  }

  return (
    <main className="flex p-10 ">
      <QueryClientProvider client={queryClient}>
        <Friends />
      </QueryClientProvider>
    </main>
  );
}

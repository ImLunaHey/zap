'use client';
import { useStandaloneMode } from '../hooks/use-standalone-mode';
import { Friends } from './friends';
import { useLocalStorage } from '@uidotdev/usehooks';
import AddToHomeScreenButton from './add-to-homescreen-button';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from './notifications';
import { Button } from './button';
import { Box } from './box';
import { version } from '@/../package.json';

const queryClient = new QueryClient();

export default function App() {
  const isStandalone = useStandaloneMode();
  const [isSetup] = useLocalStorage('isSetup', false);
  const origin = window?.location?.origin.includes('localhost') ? 'localhost' : 'production';

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
        <div className="flex flex-col gap-2">
          <Friends />
          <div className="flex flex-row gap-2 flex-wrap">
            <Button
              onClick={() => {
                window.location.reload();
              }}
              className="flex flex-row gap-2 items-center"
            >
              {/* Refresh icon */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  stroke="#FFF"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.61 5.89L15.5 9h6V3l-2.89 2.89zm0 0A9.001 9.001 0 003.055 11m2.335 7.11L2.5 21v-6h6l-3.11 3.11zm0 0A9.001 9.001 0 0020.945 13"
                ></path>
              </svg>
              Update app
            </Button>
            <Box>Environment: {origin}</Box>
            <Box>Version: {version}</Box>
          </div>
        </div>
      </QueryClientProvider>
    </main>
  );
}

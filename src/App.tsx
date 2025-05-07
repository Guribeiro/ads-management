import { IndexRoutes } from "./routes"
import { Toaster } from 'sonner'
import { QueryClientProvider, QueryClient, OmitKeyof } from '@tanstack/react-query'
import { PersistQueryClientOptions, PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { compress, decompress } from 'lz-string'

import { ThemeProvider } from "./components/theme-provider"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours cache time for garbage collection
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: '@sorocaps/ads',
  serialize: (data) => compress(JSON.stringify(data)),
  deserialize: (data) => JSON.parse(decompress(data)),
});

const persistOptions: OmitKeyof<PersistQueryClientOptions, "queryClient"> = {
  persister: localStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours (how long to keep the persisted cache)
};

function App() {
  const client = new QueryClient()
  return (
    <ThemeProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
        onSuccess={() => {
          queryClient.resumePausedMutations().then(() => {
            queryClient.invalidateQueries(); // Optional: refetch fresh data after restoring
          });
        }}
      >
        <QueryClientProvider client={client}>
          <Toaster richColors />
          <IndexRoutes />
        </QueryClientProvider>
      </PersistQueryClientProvider>

    </ThemeProvider>
  )
}

export default App

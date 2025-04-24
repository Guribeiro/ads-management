import { IndexRoutes } from "./routes"
import { Toaster } from 'sonner'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

function App() {
  const client = new QueryClient()
  return (
    <QueryClientProvider client={client}>
      <Toaster richColors />
      <IndexRoutes />
    </QueryClientProvider>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth/AuthContext.tsx'
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient()
const shouldTrack = localStorage.getItem('disable_analytics') !== 'true';
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
    <ChakraProvider value={defaultSystem}>
      <App />
      {shouldTrack && <Analytics />}
    </ChakraProvider>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './auth/AuthContext.tsx'
import { Analytics } from "@vercel/analytics/react"

const queryClient = new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
    <ChakraProvider value={defaultSystem}>
      <App />
      <Analytics />
    </ChakraProvider>
    </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
)

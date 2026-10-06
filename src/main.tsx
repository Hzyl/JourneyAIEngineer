import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { AuthCallback } from './auth/AuthCallback.tsx'

function AppRoute() {
  return window.location.pathname === '/auth/callback' ? <AuthCallback /> : <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider><AppRoute /></AuthProvider>
  </StrictMode>,
)

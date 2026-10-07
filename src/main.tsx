import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme/tokens.css'
import './theme/controls.css'
import { initializeTheme } from './theme/theme-store'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { AuthCallback } from './auth/AuthCallback.tsx'
import { InteractionFeedback } from './components/InteractionFeedback'

function AppRoute() {
  return window.location.pathname === '/auth/callback' ? <AuthCallback /> : <App />
}

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InteractionFeedback />
    <AuthProvider><AppRoute /></AuthProvider>
  </StrictMode>,
)

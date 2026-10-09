import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme/tokens.css'
import './theme/controls.css'
import { initializeTheme } from './theme/theme-store'
import { AppRoutes } from './AppRoutes'
import { AuthProvider } from './auth/AuthProvider.tsx'
import { InteractionFeedback } from './components/InteractionFeedback'
import './App.css'
import './typography.css'
import './learning-workflow.css'
import './readability.css'
import './shell-responsive.css'
import './reading-scale.css'

initializeTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InteractionFeedback />
    <AuthProvider><AppRoutes /></AuthProvider>
  </StrictMode>,
)

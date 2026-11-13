import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, I18nProvider, ThemeProvider, configureCore, createQueryClient } from '@arorms/core'
import { ToastProvider } from '@arorms/ui'
import { App } from './App'
import { languages, messages } from './i18n/messages'
import { UiLabelsBridge } from './i18n/uiLabels'
import './styles/index.css'

// 1. Everything that used to be hard-coded per project lives here, once.
configureCore({
  namespace: 'playground',
  oidc: {
    authority: import.meta.env.VITE_OAUTH_AUTHORITY,
    clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
    redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  },
  api: { baseUrl: import.meta.env.VITE_API_BASE_URL },
})

const queryClient = createQueryClient()

const root = document.getElementById('root')
if (!root) throw new Error('#root not found')

// 2. Provider order matters:
//    Theme (applies .dark) → I18n (labels) → UI labels → Auth (OIDC) → Toast (needs nothing)
//    → Query (needs nothing) → Router.
createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider config={{ messages, languages, defaultLanguage: 'EN' }}>
        <UiLabelsBridge>
          <AuthProvider>
            <ToastProvider>
              <QueryClientProvider client={queryClient}>
                <App />
              </QueryClientProvider>
            </ToastProvider>
          </AuthProvider>
        </UiLabelsBridge>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)

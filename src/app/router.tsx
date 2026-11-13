import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'
import { AppShell, CallbackPage, LoginPage, ProtectedRoute, SidebarUser } from '@arorms/ui'
import { useAuth, useT, userName } from '@arorms/core'
import { buildNav } from './nav'
import { OverviewPage } from './pages/OverviewPage'
import { ExampleCrudPage } from './pages/ExampleCrudPage'
import { RecordDetailPage } from './pages/RecordDetailPage'
import { KitPage } from '../kit/KitPage'
import type { ReactNode } from 'react'

/** The authenticated frame: every prop is project data, the design comes from the package. */
function Shell() {
  const t = useT()
  const { user, logout } = useAuth()
  const displayName = userName(user) ?? 'User'

  return (
    <AppShell
      nav={buildNav(t)}
      brand={{ title: t('app.title'), subtitle: t('app.subtitle') }}
      userSlot={<SidebarUser name={displayName} detail={t('app.subtitle')} />}
      onLogout={logout}
    />
  )
}

function LoginRoute() {
  const t = useT()
  const { user, ready } = useAuth()
  // Already signed in (e.g. back button after SSO): go straight to the app.
  if (ready && user) return <Navigate to="/" replace />
  return (
    <LoginPage
      title={t('login.title')}
      description={t('login.description')}
      signInLabel={t('login.signIn')}
      footer={t('login.hint')}
    />
  )
}

/** Route params are strings; the page wants a number. */
function RecordDetailWrapper() {
  const { id } = useParams()
  return <RecordDetailPage id={Number(id)} />
}

function guard(element: ReactNode) {
  return <ProtectedRoute>{element}</ProtectedRoute>
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginRoute /> },
  { path: '/callback', element: <CallbackPage redirectTo="/" /> },
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: guard(<OverviewPage />) },
      { path: 'example', element: guard(<ExampleCrudPage />) },
      { path: 'example/:id', element: guard(<RecordDetailWrapper />) },
      // The kit page sits outside the auth gate so the design system can always be inspected.
      { path: 'kit', element: <KitPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

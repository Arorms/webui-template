import { useEffect, useState } from 'react'
import { Activity, Layers, ShieldCheck } from 'lucide-react'
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  PageHeader,
  SkeletonStat,
  StatCard,
} from '@arorms/ui'
import { useAuth, useTheme, useT, userName } from '@arorms/core'
import { listRecords } from '../../features/example/api'

/**
 * Overview page: page header plus a stat grid fed by real data from the example store, a session
 * card, and the skeleton variant of the stat tile while the count loads.
 */
export function OverviewPage() {
  const t = useT()
  const { theme, resolved } = useTheme()
  const { user, ready } = useAuth()
  const displayName = userName(user)
  const [recordCount, setRecordCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    listRecords({ page: 0, size: 1 })
      .then((result) => {
        if (!cancelled) setRecordCount(result.total)
      })
      .catch(() => {
        if (!cancelled) setRecordCount(0)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <PageHeader
        title={t('overview.title')}
        description={t('overview.description')}
        actions={<Badge tone="primary">{t('overview.liveBadge')}</Badge>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recordCount === null ? (
          <SkeletonStat />
        ) : (
          <StatCard
            icon={Layers}
            label={t('overview.records')}
            value={recordCount}
            hint={t('overview.recordsHint')}
          />
        )}
        <StatCard
          icon={Activity}
          label={t('overview.theme')}
          value={resolved === 'dark' ? t('ui.themeDark') : t('ui.themeLight')}
          hint={`${t('overview.themeHint')} (${theme})`}
        />
        <StatCard
          icon={ShieldCheck}
          label={t('overview.session')}
          value={
            !ready
              ? t('overview.resolving')
              : user
                ? t('overview.sessionActive')
                : t('overview.sessionSignedOut')
          }
          hint={user?.profile?.email ?? displayName ?? t('overview.sessionHint')}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('overview.session')}</CardTitle>
          <CardDescription>{t('overview.sessionHint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl bg-muted p-4">
            <p className="text-[11px] font-medium text-muted-foreground">{t('overview.account')}</p>
            <p className="mt-1 text-[13px] text-foreground">
              {ready
                ? user
                  ? `${displayName ?? 'User'} · ${user.profile?.email ?? ''}`
                  : t('overview.sessionSignedOut')
                : t('overview.resolving')}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

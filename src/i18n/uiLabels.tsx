import type { ReactNode } from 'react'
import { useT } from '@arorms/core'
import { UiLabelsProvider, type UiLabels } from '@arorms/ui'

/**
 * `@arorms/ui` does not know the project's translation keys, so its own strings (close buttons,
 * pagination, loading text, theme control) are wired here — from the same `t()` the pages use, so
 * they follow the language switcher.
 */
export function UiLabelsBridge({ children }: { children: ReactNode }) {
  const t = useT()
  const labels: UiLabels = {
    close: t('common.close'),
    cancel: t('common.cancel'),
    confirm: t('common.save'),
    loading: t('common.loading'),
    empty: t('common.nothing'),
    previousPage: t('common.previous'),
    nextPage: t('common.next'),
    openMenu: t('ui.openMenu'),
    closeMenu: t('ui.closeMenu'),
    themeSystem: t('ui.themeSystem'),
    themeLight: t('ui.themeLight'),
    themeDark: t('ui.themeDark'),
    signOut: t('ui.signOut'),
    settings: t('ui.settings'),
    appearance: t('ui.appearance'),
    language: t('ui.language'),
    search: t('common.search'),
    clear: t('common.clear'),
    retry: t('common.retry'),
    back: t('common.back'),
    notProvided: t('common.none'),
  }
  return <UiLabelsProvider labels={labels}>{children}</UiLabelsProvider>
}

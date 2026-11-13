import { LayoutDashboard, Package, Sparkles } from 'lucide-react'
import type { NavGroup } from '@arorms/ui'
import type { useT } from '@arorms/core'

type T = ReturnType<typeof useT>

/**
 * Navigation is project data: the shell only renders what it is given.
 * Built as a function of `t` so labels follow the language switcher.
 */
export function buildNav(t: T): NavGroup[] {
  return [
    {
      title: t('nav.workspace'),
      items: [
        { to: '/', label: t('nav.overview'), icon: LayoutDashboard, end: true },
        { to: '/example', label: t('nav.example'), icon: Package },
      ],
    },
    {
      title: t('nav.system'),
      items: [{ to: '/kit', label: t('nav.kit'), icon: Sparkles }],
    },
  ]
}

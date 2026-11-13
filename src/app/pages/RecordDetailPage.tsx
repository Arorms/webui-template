import { useEffect, useState } from 'react'
import { Pencil } from 'lucide-react'
import {
  Badge,
  Button,
  DescriptionItem,
  DescriptionList,
  DetailHeader,
  ErrorState,
  LoadingText,
  SectionCard,
  Tag,
  type BadgeTone,
} from '@arorms/ui'
import { formatDateTime, useT } from '@arorms/core'
import { getRecord, type RecordItem, type RecordStatus } from '../../features/example/api'

const STATUS_TONE: Record<RecordStatus, BadgeTone> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  ARCHIVED: 'neutral',
}

/**
 * Detail page sample: `DetailHeader` (back link + actions) over a `SectionCard` containing a
 * `DescriptionList`. Read-only by default; the edit affordance is the page's business decision and
 * is left as a callback for the real project.
 */
export function RecordDetailPage({ id }: { id: number }) {
  const t = useT()
  const [record, setRecord] = useState<RecordItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getRecord(id)
      .then((result) => {
        if (!cancelled) setRecord(result)
      })
      .catch((cause: unknown) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) return <LoadingText />
  if (error) return <ErrorState message={error} />
  if (!record) {
    return (
      <DetailHeader title={t('example.notFound')} backTo="/example" backLabel={t('example.title')} />
    )
  }

  return (
    <>
      <DetailHeader
        title={record.name}
        backTo="/example"
        backLabel={t('example.title')}
        description={t('example.detailDescription')}
        actions={
          <Button variant="primary">
            <Pencil size={14} />
            {t('common.edit')}
          </Button>
        }
      />

      <SectionCard title={t('example.detailTitle')}>
        <DescriptionList columns={2}>
          <DescriptionItem label={t('common.name')}>{record.name}</DescriptionItem>
          <DescriptionItem label={t('example.status')}>
            <Badge tone={STATUS_TONE[record.status]}>{t(`status.${record.status}`)}</Badge>
          </DescriptionItem>
          <DescriptionItem label={t('example.owner')}>{record.owner}</DescriptionItem>
          <DescriptionItem label={t('common.created')}>
            {formatDateTime(record.createdAt)}
          </DescriptionItem>
          <DescriptionItem label={t('common.description')} className="md:col-span-2">
            {record.description}
          </DescriptionItem>
          <DescriptionItem label={t('example.tags')} className="md:col-span-2">
            {record.tags.length > 0
              ? record.tags.map((tag) => <Tag key={tag} className="mr-1">{tag}</Tag>)
              : null}
          </DescriptionItem>
        </DescriptionList>
      </SectionCard>
    </>
  )
}

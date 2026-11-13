import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Package, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Badge,
  Button,
  ChipGroup,
  ChipToggleGroup,
  ConfirmDialog,
  DataTable,
  DataTableActions,
  DataTablePrimaryCell,
  DataTableRow,
  EmptyState,
  ErrorState,
  Field,
  FilterBar,
  IconButton,
  Input,
  Modal,
  PageHeader,
  Pagination,
  SearchInput,
  Select,
  Textarea,
  type BadgeTone,
  type DataTableColumn,
} from '@arorms/ui'
import { formatDate, toMessage, useDebouncedValue, usePagedQuery, useT } from '@arorms/core'
import { listRecords, type RecordItem, type RecordStatus } from '../../features/example/api'
import { useRecordMutations } from '../../features/example/useRecordMutations'

const SIZE = 10
const STATUS_TONE: Record<RecordStatus, BadgeTone> = {
  ACTIVE: 'success',
  PENDING: 'warning',
  ARCHIVED: 'neutral',
}

interface FormState {
  name: string
  description: string
  owner: string
  status: RecordStatus
  tags: string[]
}

const EMPTY_FORM: FormState = { name: '', description: '', owner: '', status: 'ACTIVE', tags: [] }

/**
 * The canonical CRUD page. Copy this file when adding a new list screen:
 *   PageHeader → FilterBar → DataTable → Pagination
 *   Modal for create/edit, ConfirmDialog for delete, Toast feedback from the mutations.
 */
export function ExampleCrudPage() {
  const t = useT()
  const [queryDraft, setQueryDraft] = useState('')
  const [status, setStatus] = useState<RecordStatus | ''>('')
  const [editing, setEditing] = useState<RecordItem | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<RecordItem | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)

  // Debounced so typing does not fire a request per keystroke; `usePagedQuery` resets to page 0
  // whenever the filter object changes.
  const query = useDebouncedValue(queryDraft, 250)
  const { items, page, setPage, total, isLast, loading, error, reload } = usePagedQuery({
    fetchPage: (params) => listRecords(params),
    params: { q: query, status },
    pageSize: SIZE,
  })
  const { create, update, remove } = useRecordMutations(reload)

  const isSaving = create.isPending || update.isPending
  const filtering = Boolean(query || status)

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError(null)
    setFormOpen(true)
  }

  const openEdit = (record: RecordItem) => {
    setEditing(record)
    setForm({
      name: record.name,
      description: record.description,
      owner: record.owner ?? '',
      status: record.status,
      tags: record.tags,
    })
    setFormError(null)
    setFormOpen(true)
  }

  const closeForm = () => {
    if (isSaving) return
    setFormOpen(false)
    setEditing(null)
  }

  const submitForm = (event: FormEvent) => {
    event.preventDefault()
    const name = form.name.trim()
    if (!name) {
      setFormError(t('example.nameRequired'))
      return
    }
    const input = {
      name,
      description: form.description.trim(),
      owner: form.owner.trim() || undefined,
      status: form.status,
      tags: form.tags,
    }
    const done = () => setFormOpen(false)
    if (editing) update.mutate({ id: editing.id, input }, { onSuccess: done })
    else create.mutate(input, { onSuccess: done })
  }

  const toggleTag = (tag: string) =>
    setForm((current) => ({
      ...current,
      tags: current.tags.includes(tag)
        ? current.tags.filter((value) => value !== tag)
        : [...current.tags, tag],
    }))

  const columns: DataTableColumn[] = [
    { span: 5, header: t('common.name') },
    { span: 3, header: t('example.tags') },
    { span: 2, header: t('example.status') },
    { span: 2, header: t('common.actions'), align: 'right' },
  ]

  return (
    <>
      <PageHeader
        title={t('example.title')}
        description={t('example.description')}
        actions={
          <Button variant="primary" onClick={openCreate}>
            <Plus size={14} />
            {t('example.newRecord')}
          </Button>
        }
      />

      <FilterBar actions={<Badge>{t('common.total', { count: total })}</Badge>}>
        <SearchInput
          value={queryDraft}
          onChange={setQueryDraft}
          placeholder={t('common.search')}
          className="sm:max-w-xs"
        />
        <ChipGroup
          value={status}
          onChange={(value) => setStatus(value as RecordStatus | '')}
          options={[
            { value: '', label: t('example.filterAll') },
            { value: 'ACTIVE', label: t('status.ACTIVE') },
            { value: 'PENDING', label: t('status.PENDING') },
            { value: 'ARCHIVED', label: t('status.ARCHIVED') },
          ]}
        />
      </FilterBar>

      {error ? (
        <ErrorState message={toMessage(error)} onRetry={reload} />
      ) : !loading && items.length === 0 ? (
        <EmptyState
          icon={Package}
          title={filtering ? t('common.nothing') : t('example.empty')}
          description={filtering ? t('example.emptyFilteredHint') : t('example.emptyHint')}
          action={
            filtering ? undefined : (
              <Button variant="primary" onClick={openCreate}>
                <Plus size={14} />
                {t('example.createFirst')}
              </Button>
            )
          }
        />
      ) : (
        <>
          <DataTable columns={columns} loading={loading} loadingRows={5}>
            {items.map((record) => (
              <DataTableRow key={record.id} columns={columns}>
                <DataTablePrimaryCell
                  title={
                    <Link to={`/example/${record.id}`} className="hover:text-primary">
                      {record.name}
                    </Link>
                  }
                  meta={`${formatDate(record.createdAt)}${record.owner ? ` · ${record.owner}` : ''}`}
                />
                <div className="flex min-w-0 flex-wrap gap-1">
                  {record.tags.length === 0 ? (
                    <span className="text-[12px] text-muted-foreground">—</span>
                  ) : (
                    record.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
                <div>
                  <Badge tone={STATUS_TONE[record.status]}>{t(`status.${record.status}`)}</Badge>
                </div>
                <DataTableActions>
                  <IconButton onClick={() => openEdit(record)} title={t('common.edit')} aria-label={t('common.edit')}>
                    <Pencil size={14} />
                  </IconButton>
                  <IconButton
                    tone="danger"
                    onClick={() => setDeleting(record)}
                    title={t('common.delete')}
                    aria-label={t('common.delete')}
                  >
                    <Trash2 size={14} />
                  </IconButton>
                </DataTableActions>
              </DataTableRow>
            ))}
          </DataTable>
          <Pagination
            page={page}
            isLast={isLast}
            summary={t('common.total', { count: total })}
            onPrevious={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
          />
        </>
      )}

      {formOpen ? (
        <Modal
          title={editing ? t('example.editTitle') : t('example.createTitle')}
          onClose={closeForm}
          asForm
          onSubmit={submitForm}
          footer={
            <>
              <Button onClick={closeForm} disabled={isSaving} className="flex-1 rounded-full bg-muted text-foreground hover:bg-muted/70">
                {t('common.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={isSaving}
                loadingText={t('example.saving')}
                className="flex-1"
              >
                {editing ? t('common.save') : t('common.create')}
              </Button>
            </>
          }
        >
          <Field label={t('common.name')} required error={formError ?? undefined} htmlFor="record-name">
            <Input
              id="record-name"
              value={form.name}
              autoFocus
              placeholder={t('example.namePlaceholder')}
              onChange={(event) => {
                setForm({ ...form, name: event.target.value })
                setFormError(null)
              }}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={t('example.owner')} htmlFor="record-owner">
              <Input
                id="record-owner"
                value={form.owner}
                placeholder="name@arorms.cn"
                onChange={(event) => setForm({ ...form, owner: event.target.value })}
              />
            </Field>
            <Field label={t('example.status')} htmlFor="record-status">
              <Select
                id="record-status"
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as RecordStatus })}
              >
                <option value="ACTIVE">{t('status.ACTIVE')}</option>
                <option value="PENDING">{t('status.PENDING')}</option>
                <option value="ARCHIVED">{t('status.ARCHIVED')}</option>
              </Select>
            </Field>
          </div>
          <Field label={t('common.description')} htmlFor="record-description">
            <Textarea
              id="record-description"
              value={form.description}
              placeholder={t('example.descriptionPlaceholder')}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </Field>
          <Field label={t('example.tags')} hint={t('example.tagsHint')}>
            <ChipToggleGroup
              options={['finance', 'procurement', 'security', 'quarterly', 'archive'].map((tag) => ({
                value: tag,
                label: tag,
              }))}
              selected={form.tags}
              onToggle={toggleTag}
            />
          </Field>
        </Modal>
      ) : null}

      {deleting ? (
        <ConfirmDialog
          title={t('example.deleteTitle')}
          description={t('example.deleteDescription')}
          confirmLabel={t('common.delete')}
          cancelLabel={t('common.cancel')}
          pendingLabel={t('example.deleting')}
          tone="danger"
          isPending={remove.isPending}
          onClose={() => {
            if (!remove.isPending) setDeleting(null)
          }}
          onConfirm={() => remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })}
        />
      ) : null}
    </>
  )
}
